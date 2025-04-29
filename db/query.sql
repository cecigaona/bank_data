/*type of loan quantity*/
SELECT type_loan.Type AS LoanType, COUNT(*) AS Frequency
FROM transactions, users, user_loan, type_loan
WHERE transactions.Customer_ID = users.Customer_ID
  AND users.Customer_ID = user_loan.ID_client
  AND user_loan.ID_loan = type_loan.ID
GROUP BY type_loan.Type
ORDER BY Frequency DESC;


/*porcentajes de credit score*/
SELECT Credit_Score, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions) AS percentage
FROM transactions
GROUP BY Credit_Score;

/*que porcentage de credito es lo que usan comunmente*/
SELECT 
    FLOOR(Credit_Utilization_Ratio / 10) * 10 AS range_start,
    FLOOR(Credit_Utilization_Ratio / 10) * 10 + 9.99 AS range_end,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM transactions) AS percentage
FROM transactions
GROUP BY range_start, range_end
ORDER BY range_start;

/*cantidad de tarjetas de crédito que tienen las personas en promedio por grupo de edad*/
SELECT 
    FLOOR(Age / 5) * 5 AS age_group_start,
    FLOOR(Age / 5) * 5 + 4 AS age_group_end,
    COUNT(*) AS total_people,
    ROUND(AVG(Num_Credit_Card)) AS avg_credit_cards
FROM users
WHERE Age IS NOT NULL AND Num_Credit_Card IS NOT NULL
GROUP BY age_group_start, age_group_end
ORDER BY age_group_start;

/* Obtener el procentaje de usuarios con deuda no pagada arriba de cierto threshold*/
SELECT 
    (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM users)) AS perc_users
FROM users 
WHERE Outstanding_Debt > 500;

/*Obtener el top 5 de ocupaciones con mayor tasa de interes*/
SELECT Occupation, AVG(Interest_Rate) AS Avg_Interest
FROM users
WHERE Interest_Rate IS NOT NULL
GROUP BY Occupation
ORDER BY Avg_Interest DESC
LIMIT 5;

/*Obtener el total de usuarios con retrasos de pago y el porcentaje que representa*/
SELECT 
  (SELECT COUNT(DISTINCT Customer_ID) FROM users) AS Total_Usuarios,

  (SELECT COUNT(DISTINCT Customer_ID)
   FROM transactions
   WHERE CAST(Num_of_Delayed_Payment AS UNSIGNED) > 0 
      OR CAST(Delay_from_due_date AS UNSIGNED) > 0
  ) AS Con_Retrasos,

  ROUND(
    (SELECT COUNT(DISTINCT Customer_ID)
     FROM transactions
     WHERE CAST(Num_of_Delayed_Payment AS UNSIGNED) > 0 
        OR CAST(Delay_from_due_date AS UNSIGNED) > 0) * 100.0 /
    (SELECT COUNT(DISTINCT Customer_ID) FROM users), 2
  ) AS Porcentaje_Retrasos;

  /*Promedio en meses del historial crediticio */
  SELECT 
  ROUND(AVG(
    (CAST(SUBSTRING_INDEX(Credit_History_Age, ' Years', 1) AS UNSIGNED) * 12) +
    (CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(Credit_History_Age, 'and ', -1), ' Month', 1) AS UNSIGNED))
  ), 2) AS Promedio_Meses_Historial
FROM transactions
WHERE Credit_History_Age IS NOT NULL
  AND Credit_History_Age LIKE '%Year%' AND Credit_History_Age LIKE '%Month%';
