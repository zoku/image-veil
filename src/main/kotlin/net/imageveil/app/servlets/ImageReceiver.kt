package net.imageveil.app.servlets

import com.drew.imaging.ImageMetadataReader
import com.google.gson.GsonBuilder
import net.imageveil.app.model.ImageOptions
import io.zoku.imageveil.transformers.*
import net.imageveil.app.transformers.*
import net.imageveil.app.utils.Config
import org.slf4j.LoggerFactory
import javax.imageio.ImageIO
import javax.servlet.annotation.MultipartConfig
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import javax.xml.bind.DatatypeConverter
import java.io.ByteArrayOutputStream
import java.io.File
import java.lang.Exception
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@WebServlet(
        name = "ImageReceiver",
        displayName = "Image Receiver",
        description = "Receives an image from the app and prepares it for usage.",
        urlPatterns = [ "/imagereceiver" ]
)
@MultipartConfig
class ImageReceiver : HttpServlet() {
    private val logger = LoggerFactory.getLogger("ImageReceiver")
    private val gson = GsonBuilder().setPrettyPrinting().create()

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        // Define variables
        val options = gson.fromJson(request.getParameter("options")?:"", ImageOptions::class.java)
        val imagePart = request.getPart("image")
        var image = ImageIO.read(imagePart.inputStream)
        val imageMataData = ImageMetadataReader.readMetadata(imagePart.inputStream)

        val scaleX = image.width / options.data.width
        val scaleY = image.height / options.data.height

        val transformers = arrayListOf<Transformer>()

        // Add transformers
        transformers.add(Rotator(imageMataData))

        if (options.addNoise) {
            transformers.add(Randomiser())
        }

        when (options.mode) {
            "fill" -> transformers.add(Fill(options.areas, scaleX, scaleY))
            "square" -> transformers.add(Pixeliser(options.areas, scaleX, scaleY))
        }

        if (options.resize && (image.width > Config.imageReceiver_maxImageEdgeSize || image.height > Config.imageReceiver_maxImageEdgeSize)) {
            transformers.add(Shrinker())
        }

        // Run transformers
        transformers.forEach { transformer ->
            image = transformer.run(image)
        }

        // Prepare image as image-uri
        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        // Log process
        try {
            val logFile = File("${System.getProperty("user.home")}/imageveil-uses.log")
            logFile.appendText(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS").format(LocalDateTime.now()) + "\n")
        } catch (e: Exception) {
            logger.error("Log file could not be written.")
        }

        // Output image
        response.setIntHeader("Content-Length", imageString.length)
        response.writer.append(imageString)
    }
}