package net.imageveil.app.servlets

import com.drew.imaging.ImageMetadataReader
import com.google.gson.GsonBuilder
import net.imageveil.app.model.ImageOptions
import net.imageveil.lib.transformers.*
import net.imageveil.lib.Config
import net.imageveil.lib.ImageVeil
import net.imageveil.lib.domain.Area
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
import kotlin.math.roundToInt

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

        val areas = options.areas.map { Area(
                (it.x * scaleX).roundToInt(),
                (it.y * scaleY).roundToInt(),
                (it.width * scaleX).roundToInt(),
                (it.height * scaleY).roundToInt()
        ) }

        val veil = ImageVeil(imagePart.inputStream)

        // Add transformers
        veil.addTransformerToQueue(Rotate(imageMataData))

        if (options.addNoise) {
            veil.addTransformerToQueue(Noise(Config.transformers_noise_percentageToAdd, Config.transformers_noise_intensityOfNoise))
        }

        when (options.mode) {
            "fill" -> veil.addTransformerToQueue(Fill(areas))
            "square" -> veil.addTransformerToQueue(SquareMosaic(areas))
        }

        if (options.resize && (image.width > Config.transformers_scaleDown_maxImageEdgeSize || image.height > Config.transformers_scaleDown_maxImageEdgeSize)) {
            veil.addTransformerToQueue(ScaleDown())
        }

        // Run transformers
        image = veil.run()

        // Prepare image as image-uri
        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        // Log process
        val statsFilePath = servletContext.getRealPath(File.separator) + "../imageveil-uses.csv"
        try {
            val logFile = File(statsFilePath)
            logFile.appendText(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS").format(LocalDateTime.now()) + "\n")
        } catch (e: Exception) {
            logger.error("Stats file '$statsFilePath' could not be written.")
        }

        // Output image
        response.setIntHeader("Content-Length", imageString.length)
        response.writer.append(imageString)
    }
}