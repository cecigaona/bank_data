/*type of loan quantity*/
SELECT 'Credit-Builder Loan' AS LoanType, COUNT(*) AS Frequency
FROM transactions
WHERE Type_of_Loan LIKE '%Credit-Builder Loan%'
UNION ALL
SELECT 'Personal Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Personal Loan%'
UNION ALL
SELECT 'Debt Consolidation Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Debt Consolidation Loan%'
UNION ALL
SELECT 'Student Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Student Loan%'
UNION ALL
SELECT 'Payday Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Payday Loan%'
UNION ALL
SELECT 'Mortgage Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Mortgage Loan%'
UNION ALL
SELECT 'Auto Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Auto Loan%'
UNION ALL
SELECT 'Home Equity Loan', COUNT(*)
FROM transactions
WHERE Type_of_Loan LIKE '%Home Equity Loan%'
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

