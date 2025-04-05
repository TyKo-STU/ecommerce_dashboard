from flask import Flask, jsonify, render_template, Response
import sqlite3, pathlib

working_directory = pathlib.Path(__file__).parent.absolute()
DATABASE = working_directory / 'CCL_ecommerce.db'

def query_db(query: str, args=()) -> list:
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        result = cursor.execute(query, args).fetchall()
    return result

app = Flask(__name__)

@app.route('/')
def index() -> str:
    return render_template('dashboard.html')

@app.route("/api/orders_over_time")
def orders_over_time() -> Response:
    query = """
    SELECT order_date, COUNT(order_id) AS num_orders
    FROM orders
    GROUP BY order_date
    ORDER BY order_date;
    """
    result = query_db(query)

    dates = [row[0] for row in result]
    counts = [row[1] for row in result]
    return jsonify({"dates": dates, "counts": counts})

# Register a route in Flask to handle requests to "/api/low_stock_levels"
@app.route("/api/low_stock_levels")
# Define the endpoint function that returns a Flask Response object
def low_stock_levels() -> Response:
    # Define the SQL query string
    query = """
    SELECT p.product_name, s.quantity       
    FROM stock_level s                      
    JOIN products p ON s.product_id = p.product_id 
    ORDER BY s.quantity ASC;                
    """
    
    # Execute the query and store the results
    result = query_db(query)

    # Extract product names from the result
    products = [row[0] for row in result]
    # Extract quantities from the result
    quantities = [row[1] for row in result]
    
    # Return the results as a JSON response
    return jsonify({"products": products, "quantities": quantities})

# Register a route in Flask to handle requests to "/api/most_popular_products"
@app.route("/api/most_popular_products")
# Define the endpoint function that returns a Flask Response object
def most_popular_products() -> Response:
    # Define the SQL query string
    query = """
    SELECT p.product_id, p.product_name, SUM(od.quantity_ordered) AS total_quantity
    FROM order_details od
    JOIN products p ON od.product_id = p.product_id
    GROUP BY p.product_id, p.product_name
    ORDER BY total_quantity DESC
    LIMIT 10;              
    """
    
    # Execute the query and store the results
    result = query_db(query)

    # Extract product names from the result
    products = [row[1] for row in result]
    # Extract quantities from the result
    quantities = [row[2] for row in result]
    
    # Return the results as a JSON response
    return jsonify({"products": products, "quantities": quantities})

if __name__ == '__main__':
    app.run(debug=True)