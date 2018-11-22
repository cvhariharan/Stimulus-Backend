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
(optional) mined (bool): Set to *true* to get mined articles. Default *false*

3. POST /channel/subscribe  
*Content-Type: multipart/form-data*  
**Params** -  
phrase (Text): Randombly generated 32 character string  
signature (Text): Phrase signed by the user's private key  
channel (Text): The address of the author to subscribe to  
  
4. POST /news/getNews  
*Content-Type: multipart/form-data*  
**Params** -  
phrase (Text): Randombly generated 32 character string  
signature (Text): Phrase signed by the user's private key  
(optional) mined (Text): Set to *'true'* to get mined articles. Default *'false'*  
  
5. POST /login  
*Content-Type: multipart/form-data*  
**Params** -  
name (Text): Name of the user  
bio (Text): User description  
phrase (Text): Randomly generated 32 character string  
signature (Text): Phrase signed by the user's private key