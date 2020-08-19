package detectionServices;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.rekognition.AmazonRekognition;
import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
import com.amazonaws.services.rekognition.model.*;

import java.util.ArrayList;
import java.util.List;

public class DetectLabels {

    public static List<String> detectLabels(String BucketName, String ImageName) {

        AWSCredentials credentials = new BasicAWSCredentials(

        );

        AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion("eu-west-1")
                .build();

        DetectLabelsRequest request = new DetectLabelsRequest()
                .withImage(new Image()
                        .withS3Object(new S3Object()
                                .withName(ImageName).withBucket(BucketName)))
                .withMaxLabels(10)
                .withMinConfidence(75F);

        try {
            DetectLabelsResult result = rekognitionClient.detectLabels(request);
            List<Label> labels = result.getLabels();

            List<String> labelNames = new ArrayList<String>();

            System.out.println("Detected Labels for " + ImageName);
            for (Label label : labels) {
                labelNames.add(label.getName());
                System.out.println(label.getName() + ": " + label.getConfidence().toString());
            }
            System.out.println("\n");
            return labelNames;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
