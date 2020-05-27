<?php
class Product_category{
    //database connection and table name
    private $conn;
    private $table_name = "product_category";

    //object properties
    public $id;
    public $category_name;

    //constructor with $db as database connection
    public function __construct($db) 
    {
        $this->conn = $db;    
    }

    function read() {
        $query = "SELECT * From " .$this->table_name;
        $stmt = $this->conn->prepare($query);

        $stmt->execute();
        
        return $stmt;
    }
}
?>