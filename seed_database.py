import csv
import mysql.connector

# CSV filename
csv_filename = 'transactions.csv'

# MySQL database connection parameters
db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'database': 'bank',
    'user': 'root',
    'password': ''
}

# Connect to the MySQL database using mysql-connector-python
conn = mysql.connector.connect(**db_config)
cursor = conn.cursor()

# Open and read the CSV file
with open(csv_filename, newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)

    # Extract the header row for column names
    header = next(csvreader)

    # Build the CREATE TABLE query.
    columns_definition = ', '.join([f"`{col}` TEXT" for col in header])
    create_table_query = f"CREATE TABLE IF NOT EXISTS transactions ({columns_definition});"
    cursor.execute(create_table_query)
    print("Table 'transactions' created with columns:", header)

    # Prepare the INSERT query with parameter placeholders
    placeholders = ', '.join(['%s'] * len(header))
    columns_names = ', '.join([f"`{col}`" for col in header])
    insert_query = f"INSERT INTO transactions ({columns_names}) VALUES ({placeholders});"

    # Insert each CSV row into the 'users' table
    for row in csvreader:
        cursor.execute(insert_query, row)

    # Commit the transaction to save the changes
    conn.commit()
    print("CSV data has been inserted into the 'transactions' table.")

# Clean up and close the connection
cursor.close()
conn.close()