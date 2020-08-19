package S3.Upload.Services;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.PutObjectResult;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class UploadS3 {

    public Boolean uploadToS3(String BucketName, MultipartFile ImageFile) throws IOException {
        AWSCredentials credentials = new BasicAWSCredentials(
                "null",
                "null"
        );

        AmazonS3 s3client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.EU_WEST_1)
                .build();

        ObjectMetadata meta = new ObjectMetadata();
        meta.setContentType("image/jpg");

        PutObjectResult result = s3client.putObject(
                new PutObjectRequest(BucketName, ImageFile.getOriginalFilename(), ImageFile.getInputStream(), meta)
        );
        return true;
    }

}
