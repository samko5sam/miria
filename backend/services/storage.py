import boto3
from botocore.exceptions import ClientError
import os
from flask import current_app

class StorageService:
    # File size limits in bytes
    MAX_PROFILE_PICTURE_SIZE = 5 * 1024 * 1024  # 5MB
    MAX_PRODUCT_FILE_SIZE = 100 * 1024 * 1024  # 100MB
    
    def __init__(self):
        self.endpoint_url = os.environ.get('MINIO_ENDPOINT')
        self.access_key = os.environ.get('MINIO_ACCESS_KEY')
        self.secret_key = os.environ.get('MINIO_SECRET_KEY')
        self.public_bucket = os.environ.get('MINIO_PUBLIC_BUCKET')
        self.private_bucket = os.environ.get('MINIO_PRIVATE_BUCKET')
        
        if not all([self.endpoint_url, self.access_key, self.secret_key, self.public_bucket, self.private_bucket]):
            current_app.logger.warning("MinIO configuration missing. Storage service may not work.")
            self.s3_client = None
        else:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=self.access_key,
                aws_secret_access_key=self.secret_key,
                config=boto3.session.Config(signature_version='s3v4')
            )

    def upload_file(self, file_obj, object_name, bucket_name, content_type=None):
        """Upload a file to specified bucket"""
        if not self.s3_client:
            return None
            
        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            
            self.s3_client.upload_fileobj(
                file_obj,
                bucket_name,
                object_name,
                ExtraArgs=extra_args
            )
            return object_name
        except ClientError as e:
            current_app.logger.error(f"Error uploading file: {e}")
            return None

    def generate_presigned_url(self, object_name, bucket_name, expiration=3600):
        """Generate a presigned URL for downloading a file"""
        if not self.s3_client:
            return None
            
        try:
            response = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket_name, 'Key': object_name},
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            current_app.logger.error(f"Error generating presigned URL: {e}")
            return None

    def delete_file(self, object_name, bucket_name):
        """Delete a file from specified bucket"""
        if not self.s3_client:
            return False
            
        try:
            self.s3_client.delete_object(Bucket=bucket_name, Key=object_name)
            return True
        except ClientError as e:
            current_app.logger.error(f"Error deleting file: {e}")
            return False
    
    def get_public_url(self, object_name):
        """Get public URL for a file in the public bucket"""
        endpoint = self.endpoint_url.rstrip('/')
        return f"{endpoint}/{self.public_bucket}/{object_name}"
    
    def get_private_url(self, object_name):
        """Get URL for a file in the private bucket (for storage reference)"""
        endpoint = self.endpoint_url.rstrip('/')
        return f"{endpoint}/{self.private_bucket}/{object_name}"
