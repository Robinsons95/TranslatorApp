package S3.Upload.Controllers;

import S3.Upload.Models.ResponseData;
import S3.Upload.Services.UploadS3;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class UploadController {

    @Autowired
    private UploadS3 uploadS3;
    public static long count = 0;

    @GetMapping("/stats")
    public String getStats() {
        return "Service called: " + count + " times";
    }

    @PostMapping("/postData")
    public ResponseData handlePostData(@RequestParam("BucketName") String BucketName, @RequestParam("ImageFile") MultipartFile multipartFile) throws IOException {
        count++;
        // Handle MultipartFile //
        if (multipartFile.isEmpty()) {
            System.out.println("Error - multipartFile is empty");
            return new ResponseData(false);
        }
        if (!(multipartFile.getContentType().equals("image/jpg"))) {
            System.out.println("Error - multipartFile is not image");
            return new ResponseData(false);
        }

        // Upload Image to S3 Bucket //
        if (uploadS3.uploadToS3(BucketName, multipartFile)) {
            return new ResponseData(true);
        }

        return new ResponseData(false);
    }

}
