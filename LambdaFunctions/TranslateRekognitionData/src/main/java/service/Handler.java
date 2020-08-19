package service;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.darkprograms.speech.translator.GoogleTranslate;

import java.io.IOException;

public class Handler implements RequestHandler<Request, Response> {

    @Override
    public Response handleRequest(Request request, Context context) {
        Response response = new Response();

        for (String s : request.getWordList()) {
            try {
                String translated = GoogleTranslate.translate(request.getIso639(), s);
                System.out.println(translated);
                response.addList(translated);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return response;
    }
}
