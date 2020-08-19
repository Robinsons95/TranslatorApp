package service;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;

public class Handler implements RequestHandler<Request, Response> {

    public Response handleRequest(Request request, Context context) {
        Response response = new Response();
        HashMap<String, String> hashMap = new HashMap<String, String>();
        try {
            Class.forName("com.mysql.jdbc.Driver");
            Connection con = DriverManager.getConnection();

            Statement stmt = con.createStatement();
            ResultSet rs = stmt.executeQuery("select * from lang_iso");

            while (rs.next()) {
                hashMap.put(rs.getString(2), rs.getString(3));
            }

            response.setLangauges(hashMap);

            con.close();
        } catch (Exception e) {
            System.out.println("mysql error: " + e);
        }
        return response;
    }

}
