package models;

//import com.fasterxml.jackson.annotation.JsonProperty;

public class RequestData {

    //@JsonProperty("BucketName")
    private String bucketname;

    //@JsonProperty("ImageName")
    private String imagename;

    public String getBucketname() {
        return bucketname;
    }

    public void setBucketname(String bucketname) {
        this.bucketname = bucketname;
    }

    public String getImagename() {
        return imagename;
    }

    public void setImagename(String imagename) {
        this.imagename = imagename;
    }

    public RequestData(String bucketname, String imagename) {
        this.bucketname = bucketname;
        this.imagename = imagename;
    }

    public RequestData() {
    }
}
