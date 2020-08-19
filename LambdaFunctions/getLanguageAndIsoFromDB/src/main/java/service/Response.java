package service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;

public class Response {
    private HashMap<String, String> languages;

    public Response() {
    }

    public Response(HashMap<String, String> languages) {
        this.languages = languages;
    }

    public HashMap<String, String> getlanguages() {
        return languages;
    }

    public void setLangauges(HashMap<String, String> languages) {
        this.languages = languages;
    }

}
