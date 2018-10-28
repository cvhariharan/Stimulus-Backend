## API DOC

1. POST /upload  
*Content-Type: multipart/form-data*  
**Params** -  
upload (File) : File to be uploaded    
title (Text) : Title of the article  
signature (Text) : Keyphrase signed by the user using her/his private key  
Keyphrase (Text) : Randomly generated string of 32 characters  
  
2. GET /news/:authorHash  
**Params** -   
authorHash (Text): public key of the author