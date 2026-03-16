package com.primaria.backend;
import java.sql.Connection;
import java.sql.DriverManager;

public class TestDB {
    public static void main(String[] args) {
        String url = "jdbc:mysql://127.0.0.1:3306/primaria_db";
        String user = "federico";
        String password = "federico";

        try {
            Connection conn = DriverManager.getConnection(url, user, password);
            if (conn != null) {
                System.out.println("Conexión exitosa a la base de datos!");
                conn.close();
            }
        } catch (Exception e) {
            System.out.println("Error de conexión: " + e.getMessage());
        }
    }
}
