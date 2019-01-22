# ImageVeil App
ImageVeil is an app for image anonymisation. It can be run in jvm servlet conrainers.

It is written in Kotlin, Javascript (jQuery), HTML5 and CCS3.

*ImageVeil App* uses *[ImageVeil Lib](https://github.com/zoku/image-veil-lib)* to process images.

## Installation
### Config
Do net forget to rename or copy `/src/main/resources/mailer.properties.tpl` to `/src/main/resources/mailer.properties` and fill out the missing fields! Otherwise the contact form will not work!

### Imprint
You need to edit the imprint's content to reflect the actual provider's data!

### Server
#### Test
Run in Tomcat:
```
mvn clean package tomcat7:run
```

This app is tested in Tomcat 7 and Tomcat 8 with JRE 1.8.

#### Production
Compile to a war file (mvn clean package) and copy it to your Tomcat's webapps folder.

#### Config
You might want to disable logging. If not: Remove the corresponding passages from the pages' markdown files.