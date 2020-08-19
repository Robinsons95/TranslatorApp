package detectionServices;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.rekognition.AmazonRekognition;
import com.amazonaws.services.rekognition.AmazonRekognitionClientBuilder;
import com.amazonaws.services.rekognition.model.*;

import java.util.ArrayList;
import java.util.List;

public class DetectText {

    public static List<String> detectText(String BucketName, String ImageName) {

        AWSCredentials credentials = new BasicAWSCredentials(

        );

        AmazonRekognition rekognitionClient = AmazonRekognitionClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion("eu-west-1")
                .build();

        DetectTextRequest request = new DetectTextRequest()
                .withImage(new Image()
                        .withS3Object(new S3Object()
                                .withName(ImageName)
                                .withBucket(BucketName)));

        try {
            DetectTextResult result = rekognitionClient.detectText(request);
            List<TextDetection> textDetections = result.getTextDetections();

            List<String> detectedTexts = new ArrayList<String>();
            System.out.println("Detected lines and words for " + ImageName);
            for (TextDetection text : textDetections) {
                detectedTexts.add(text.getDetectedText());
                System.out.println("Detected: " + text.getDetectedText());
//                System.out.println("Confidence: " + text.getConfidence().toString());
//                System.out.println("Id : " + text.getId());
//                System.out.println("Parent Id: " + text.getParentId());
//                System.out.println("Type: " + text.getType());
//                System.out.println();
            }
            return detectedTexts;
        } catch (AmazonRekognitionException e) {
            e.printStackTrace();
        }
        return null;
    }

}
