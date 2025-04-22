import os
import numpy as np
import pandas as pd

# Verificar si el archivo existe
csv_path = "/Users/ceciliagaona/Documents/CUARTO_SEMESTRE/BASES/archive/db/train.csv"
if not os.path.exists(csv_path):
    print(f"Error: No se encontró el archivo '{csv_path}'")
    exit()

# Cargar el CSV
full_csv = pd.read_csv(csv_path)

# Esquema de las tablas
scheme = {
    "transactions": ["ID", "Customer_ID", "Month", "Monthly_Inhand_Salary",
                     "Num_of_Loan", "Delay_from_due_date", "Num_of_Delayed_Payment",
                     "Changed_Credit_Limit", "Credit_Utilization_Ratio", "Credit_History_Age",
                     "Payment_of_Min_Amount", "Amount_invested_monthly", "Payment_Behaviour",
                     "Monthly_Balance", "Credit_Score"]
}

# Crear archivos separados
for table_name, columns in scheme.items():
    # Verificar que las columnas existan en el CSV
    missing_columns = [col for col in columns if col not in full_csv.columns]
    if missing_columns:
        print(f"⚠️ Advertencia: Estas columnas no existen en '{table_name}': {missing_columns}")
        continue  # Saltar esta tabla si faltan columnas

    # Crear el DataFrame con las columnas especificadas
    current_df = full_csv[columns].copy()

    # Guardar en CSV separado
    output_file = f"{table_name}.csv"
    current_df.to_csv(output_file, index=False)
    print(f"✅ Archivo '{output_file}' creado correctamente.")

print("✅ Proceso completado.")
