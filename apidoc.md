## API DOC

1. POST /upload  
*Content-Type: multipart/form-data*  
**Params** -  
upload (File) : File to be uploaded    
title (Text) : Title of the article  
signature (Text) : Keyphrase signed by the user using her/his private key  
Keyphrase (Text) : Randomly generated string of 32 characters  
  
- **Output**  
*{"hash": "7639heuhafi78u9er", "author": "0x2a5f493594ef5e7d81448c237dfb87003485fce5"}*
2. GET /news/:authorHash  
**Params** -   
authorHash (Text): public key of the author  
(optional) mined (bool): Set to *true* to get mined articles. Default *false*
  
- **Output**  
*{"results":[{"_id":"QmVncwUQQgiQm6Vxmf8fLP9a8kEfcHTxDoWNRCPCshaPJw","title":"File Upload","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmbTP6hhHnvVJjXZ4u5ouiEZoNj6iKHB1SP2jByC4LVpCp","title":"Index","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false}]*

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

- **Output**  
*{"news":[{"_id":"QmVncwUQQgiQm6Vxmf8fLP9a8kEfcHTxDoWNRCPCshaPJw","title":"File Upload","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmbTP6hhHnvVJjXZ4u5ouiEZoNj6iKHB1SP2jByC4LVpCp","title":"Index","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmZUVnK4Fd4juz5BmeGPhToWBiWgMZk34ggakaCoEtYvhh","title":"Test screenshot","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmUfcJYYxBZpMGGKKuh9TAjZuJaKJY3cVd9nquMZ8t19m1","title":"screenshot","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmZwsGKPtyY2uUhviBu1VcV6pPHxrmQmFfPtXPSNS6GjFu","title":"Test","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmZgeEgwyacDGWo8f45soZQhy1oHwJGaWmbWDSwM1o1yyK","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false}]}*
  
5. POST /login  
*Content-Type: multipart/form-data*  
**Params** -  
name (Text): Name of the user  
bio (Text): User description  
phrase (Text): Randomly generated 32 character string  
signature (Text): Phrase signed by the user's private key  
  
- **Output**  
*{"author":"0x0ba3e2754aac1589f45b13c9b03905060d597679","result":"Welcome!"}*
6. GET /news/search/:keyword  
**Params**  
keyword (Text)  
  
- **Output**  
*{"news":[{"_id":"QmZUVnK4Fd4juz5BmeGPhToWBiWgMZk34ggakaCoEtYvhh","title":"Test screenshot","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false},{"_id":"QmZwsGKPtyY2uUhviBu1VcV6pPHxrmQmFfPtXPSNS6GjFu","title":"Test","author":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","Mined":false,"Published":false}]}*  
  
7. GET /news/users/search/:keyword  
**Params**  
keyword (Text): Name of the user to search  
  
- **Output**  
*{"users":[{"_id":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","name":"Hariharan","bio":"Programmer","channel":["Channel1","Channel2","0x2a5F493594eF5E7d81448c237dFB87003485fce5"],"reputation":0}]}*  
  
8. GET /:user  
**Params**  
user (Text): User's public key  
  
- **Output**  
*[{"_id":"0x2a5f493594ef5e7d81448c237dfb87003485fce5","name":"Hariharan","bio":"Programmer","channel":["Channel1","Channel2","0x2a5F493594eF5E7d81448c237dFB87003485fce5"],"reputation":0}]*