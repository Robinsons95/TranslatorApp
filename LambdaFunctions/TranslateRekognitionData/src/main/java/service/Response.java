package service;

import java.util.ArrayList;
import java.util.List;

public class Response {
    private List<String> responseList;

    public void addList(String s) {
        this.responseList.add(s);
    }

    public List<String> getResponseList() {
        return responseList;
    }

    public void setResponseList(List<String> responseList) {
        this.responseList = responseList;
    }

    public Response(List<String> responseList) {
        this.responseList = responseList;
    }

    public Response() {
        this.responseList = new ArrayList<String>();
    }
}
