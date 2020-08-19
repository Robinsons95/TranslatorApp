package S3.Upload.Models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResponseData {

    private Boolean didWork;
    private String message;

    public ResponseData(Boolean didWork) {
        this.didWork = didWork;
        if(didWork)
            this.message = "yes";
        else
            this.message = "no";
    }
}
