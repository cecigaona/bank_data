import csv
from collections import defaultdict, Counter

# Filenames
input_file = "cleaned_users.csv"  # Your original CSV
output_file = "cleaned_users2.csv"  # The new CSV with one registry per user

with open(input_file, newline='') as csvfile:
    reader = csv.reader(csvfile)
    rows = list(reader)

# Clean empty or invalid rows
cleaned_rows = []
for row in rows:
    if any(field.strip() == "" for field in row):  # Remove empty fields
        continue
    if any(field.strip() in {"_", "_______"} for field in row):  # Remove invalid placeholders
        continue
    try:
        age = int(row[2])
        if age < 18 or age > 100:
            continue
    except Exception as e:
        continue
    if any(field == "_" for i, field in enumerate(row) if i not in {0, 5}):  # "_" only allowed in columns 0 and 5
        continue
    cleaned_rows.append(row)

user_rows = defaultdict(list)
for row in cleaned_rows:
    if not row:
        continue
    user = row[0]  # Assuming first column is customer_ID
    user_rows[user].append(row)

selected_rows = []
for user, rows in user_rows.items():
    freq = Counter(row[11] for row in rows)  # Most common value in column 11
    most_common_value, _ = freq.most_common(1)[0]

    best_row = None
    for row in rows:
        if row[11] == most_common_value:  # Prioritize most common value in column 11
            if best_row is None or best_row[3].count('-') != 2:  # SSN (index 3) should have exactly 2 dashes
                best_row = row

    if best_row:
        selected_rows.append(best_row)

with open(output_file, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerows(selected_rows)


