from app import create_app
from extensions import db
from models import Product

app = create_app()

with app.app_context():
    products = Product.query.all()
    print(f'Total products: {len(products)}')
    
    for p in products:
        print(f'Product {p.id}: name="{p.name}", is_active={p.is_active}, type={type(p.is_active)}')
    
    # Try to toggle one product
    if products:
        test_product = products[0]
        print(f'\nTesting toggle on product {test_product.id}')
        print(f'Before: is_active = {test_product.is_active}')
        
        test_product.is_active = not test_product.is_active
        
        print(f'After toggle: is_active = {test_product.is_active}')
        
        try:
            db.session.commit()
            print('SUCCESS: Commit succeeded')
        except Exception as e:
            db.session.rollback()
            print(f'ERROR: {e}')
