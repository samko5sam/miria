"""Add image_url, is_active, and updated_at to Product model

Revision ID: a9d8e7f6c5b4
Revises: 1fcbba69433f
Create Date: 2025-12-12 11:10:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a9d8e7f6c5b4'
down_revision = '96fc1edf92df'
branch_labels = None
depends_on = None


def upgrade():
    # Add new columns to products table
    op.add_column('products', sa.Column('image_url', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'))
    op.add_column('products', sa.Column('updated_at', sa.DateTime(), nullable=True))
    
    # Update existing rows to have updated_at = created_at
    op.execute('UPDATE products SET updated_at = created_at WHERE updated_at IS NULL')


def downgrade():
    # Remove columns from products table
    op.drop_column('products', 'updated_at')
    op.drop_column('products', 'is_active')
    op.drop_column('products', 'image_url')
