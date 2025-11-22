<?php
$servername = "localhost";
$username = "root";
$password = ""; // thường mặc định là rỗng
$dbname = "timviec";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
?>