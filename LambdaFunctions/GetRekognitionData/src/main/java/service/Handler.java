package service;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import detectionServices.DetectLabels;
import detectionServices.DetectText;
import models.RequestData;

import java.util.HashMap;
import java.util.List;

public class Handler implements RequestHandler<RequestData, HashMap<String, List<String>>> {

    @Override
    public HashMap<String, List<String>> handleRequest(RequestData data, Context context) {

//        S3EventNotification.S3EventNotificationRecord record = s3Event.getRecords().get(0);
//        String BucketName = record.getS3().getBucket().getName();
//        String ImageName = record.getS3().getObject().getUrlDecodedKey();

        String BucketName = data.getBucketname();
        String ImageName = data.getImagename();

        System.out.println("BucketName: " + BucketName + "\n" + "ImageName: " + ImageName);

        if (BucketName == null || ImageName == null)
            return null;

        HashMap<String, List<String>> hm = new HashMap<String, List<String>>();
        hm.put("label", DetectLabels.detectLabels(BucketName, ImageName));
        hm.put("text", DetectText.detectText(BucketName, ImageName));

        return hm;
    }

}
