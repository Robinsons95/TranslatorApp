package service;

import java.util.List;

public class Request {

    private List<String> wordList;
    private String iso639;

    public List<String> getWordList() {
        return wordList;
    }

    public void setWordList(List<String> wordList) {
        this.wordList = wordList;
    }

    public String getIso639() {
        return iso639;
    }

    public void setIso639(String iso639) {
        this.iso639 = iso639;
    }

    public Request(List<String> wordList, String iso639) {
        this.wordList = wordList;
        this.iso639 = iso639;
    }

    public Request() {
    }
}
