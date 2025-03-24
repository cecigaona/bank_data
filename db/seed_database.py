import csv
import mysql.connector
import os

# CSV filename - using the correct filename
csv_filename = '/Users/ceciliagaona/Documents/CUARTO_SEMESTRE/BASES/archive/db/transactions.csv'

# Verify the CSV file exists in the current directory
if not os.path.exists(csv_filename):
    print(f"Error: File '{csv_filename}' not found in {os.getcwd()}")
    print("Please ensure the CSV file is in the same directory as this script.")
    exit(1)

# MySQL database configuration (same as original)
db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'bank',
    'user': 'root',
    'password': ''  # Keep empty as in original
}

try:
    # Connect to MySQL (same connection as original)
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()

    # Open and read the CSV file (same as original)
    with open(csv_filename, newline='', encoding='utf-8') as csvfile:
        csvreader = csv.reader(csvfile)

        # Extract the header row (same as original)
        header = next(csvreader)

        # Build the CREATE TABLE query (same as original)
        columns_definition = ', '.join([f"`{col}` TEXT" for col in header])
        create_table_query = f"CREATE TABLE IF NOT EXISTS transactions ({columns_definition});"
        cursor.execute(create_table_query)
        print("Table 'transactions' created with columns:", header)

        # Prepare the INSERT query (same as original)
        placeholders = ', '.join(['%s'] * len(header))
        columns_names = ', '.join([f"`{col}`" for col in header])
        insert_query = f"INSERT INTO transactions ({columns_names}) VALUES ({placeholders});"

        # Insert each row (same as original)
        for row in csvreader:
            cursor.execute(insert_query, row)

        # Commit changes (same as original)
        conn.commit()
        print(f"Successfully inserted data from {csv_filename} into 'transactions' table.")

except mysql.connector.Error as err:
    print(f"Database error: {err}")
except Exception as e:
    print(f"Error: {e}")
finally:
    # Clean up (same as original)
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()