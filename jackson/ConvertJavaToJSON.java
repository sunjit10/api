package jackson;

import java.io.File;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.Versioned;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializationFeature;

public class ConvertJavaToJSON {
    public static void main(String[] args) throws Exception {
	Person person = new Person("Mike", 23);
	ObjectMapper objectMapper = new ObjectMapper();
	//objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);

	try {
	    String json = objectMapper.writeValueAsString(person);
	    System.out.println(json);
	} catch (JsonProcessingException e) {
	    e.printStackTrace();
	}
    }
}
