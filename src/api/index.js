const express = require("express");
const snowflake = require("snowflake-sdk");
const cors = require("cors");

const app = express();
app.use(cors());

const connection = snowflake.createConnection({
    account: 'uhb58XXX.us-east-1',
    username: 'XXX',
    password: 'XXXX',
    role: 'ACCOUNTADMIN',
    warehouse: 'COMPUTE_WH',
    database: 'CDC_STREAM',
    schema: 'PUBLIC'
     
});


connection.connect((err) => {
  if (err) {
    console.error("Unable to connect:", err.message);
  } else {
    console.log("Successfully connected to Snowflake.");
  }
});

app.get("/api/report", async (req, res) => {
  try {
    const sqlText = 'SELECT warehouse_name,SUM(credits_used)+1 AS credits_used FROM snowflake.account_usage.warehouse_metering_history GROUP BY 1;';
  

    connection.execute(
      {
        sqlText,
        complete: (err, stmt, rows) => {
          if (err) {
            console.error("Failed to execute statement due to the following error:", err.message);
          } else {
            res.json(rows);
          }
        },
      },
      { resultSet: true }
    );
  } catch (error) {
    res.status(500).send("Error fetching data from Snowflake");
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
