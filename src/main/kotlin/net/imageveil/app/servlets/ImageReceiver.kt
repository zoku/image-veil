package net.imageveil.app.servlets

import com.drew.imaging.ImageMetadataReader
import com.google.gson.GsonBuilder
import net.imageveil.app.model.ImageOptions
import net.imageveil.app.model.ImageResponse
import net.imageveil.app.utils.Config
import net.imageveil.app.utils.I18n
import net.imageveil.lib.transformers.*
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
import java.util.*
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
        val i18n = (request.getAttribute("i18n") ?: I18n(Locale.ENGLISH)) as I18n

        // Define variables
        val options = gson.fromJson(request.getParameter("options")?:"", ImageOptions::class.java)
        val imagePart = request.getPart("image")

        if (imagePart.size > 5_242_880) {
            response.writer.append(
                    gson.toJson(
                            ImageResponse(success = false, error = i18n
                                    .get(key = "js.fileSizeHint")
                                    .replace("[size1]", "%.2f".format(imagePart.size / 1024f / 1024f))
                                    .replace("[size2]", "%.2f".format(5_242_880 / 1024f / 1024f))
                            )
                    )
            )
            return
        }

        if (imagePart.contentType != "image/jpeg") {
            response.writer.append(
                    gson.toJson(
                            ImageResponse(success = false, error = i18n
                                    .get(key = "js.fileTypeHint")
                                    .replace("[type]", imagePart.contentType)
                            )
                    )
            )
            return
        }

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
            "fill" -> veil.addTransformerToQueue(Fill(areas, Config.transformers_masks_fill_color))
            "square" -> veil.addTransformerToQueue(SquareMosaic(areas, Config.transformers_masks_squareMosaic_squareSize))
            "crystallize" -> veil.addTransformerToQueue(Crystallize(areas, Config.transformers_masks_crystallize_cells, Config.transformers_masks_crystallize_scaleFactor))
        }

        if (options.resize && (image.width > Config.transformers_scaleDown_maxImageEdgeSize || image.height > Config.transformers_scaleDown_maxImageEdgeSize)) {
            veil.addTransformerToQueue(ScaleDown())
        }

        // Run transformers
        image = veil.run()

        // Output image
        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

//        val hashBytes = MessageDigest.getInstance("SHA-256").digest(baos.toByteArray())
//        val hash = DatatypeConverter.printHexBinary(hashBytes)

//        val cipherImage = try {
//            Crypt.encrypt(baos.toByteArray())
//        } catch (e: Exception) {
//            response.sendError(500, "Could not encrypt image")
//            return
//        }

//        ImagePool[hash] = ImagePool.ImagePoolImage(cipherImage.message, LocalDateTime.now().plusHours(1))

        val jsonString = gson.toJson(ImageResponse(success = true, image = DatatypeConverter.printBase64Binary(baos.toByteArray())))
        response.setIntHeader("Content-Length", jsonString.length)
        response.writer.append(jsonString)

        // Log process
        val statsFilePath = servletContext.getRealPath(File.separator) + "../imageveil-uses.csv"
        try {
            val logFile = File(statsFilePath)
            logFile.appendText(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS").format(LocalDateTime.now()) + "\n")
        } catch (e: Exception) {
            logger.error("Stats file '$statsFilePath' could not be written.")
        }
    }
}