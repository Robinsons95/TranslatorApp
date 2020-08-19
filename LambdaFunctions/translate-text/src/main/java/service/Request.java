package service;

public class Request {

    private String text;
    private String iso639;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIso639() {
        return iso639;
    }

    public void setIso639(String iso639) {
        this.iso639 = iso639;
    }

    public Request(String text, String iso639) {
        this.text = text;
        this.iso639 = iso639;
    }

    public Request() {
    }

}
