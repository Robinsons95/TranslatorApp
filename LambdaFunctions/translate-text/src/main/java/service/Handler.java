package service;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.darkprograms.speech.translator.GoogleTranslate;

import java.io.IOException;

public class Handler implements RequestHandler<Request, Response> {

    @Override
    public Response handleRequest(Request request, Context context) {
        Response response = new Response();

        try {
            response.setText(GoogleTranslate.translate(request.getIso639(), request.getText()));
        } catch (IOException e) {
            e.printStackTrace();
        }

        return response;
    }
}
