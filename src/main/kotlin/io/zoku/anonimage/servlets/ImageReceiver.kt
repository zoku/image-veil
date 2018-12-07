package io.zoku.anonimage.servlets

import com.google.gson.GsonBuilder
import io.zoku.anonimage.model.Areas
import io.zoku.anonimage.model.ImageData
import io.zoku.anonimage.transformers.Pixeliser
import io.zoku.anonimage.transformers.Randomiser
import java.awt.Color
import java.awt.Graphics2D
import javax.imageio.ImageIO
import javax.servlet.annotation.MultipartConfig
import javax.servlet.annotation.WebServlet
import javax.servlet.http.HttpServlet
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import kotlin.math.roundToInt
import javax.xml.bind.DatatypeConverter
import java.io.ByteArrayOutputStream


@WebServlet(
        name = "ImageReceiver",
        displayName = "Image Receiver",
        description = "Receives an image from the app and prepares it for usage.",
        urlPatterns = [ "/imagereceiver" ]
)
@MultipartConfig
class ImageReceiver : HttpServlet() {
    private val gson = GsonBuilder().setPrettyPrinting().create()

    override fun doPost(request: HttpServletRequest, response: HttpServletResponse) {
        val areas = gson.fromJson(request.getParameter("areas")?:"", Areas::class.java)
        val imageData = gson.fromJson(request.getParameter("imageData")?:"", ImageData::class.java)
        val mode = request.getParameter("mode")
        val imagePart = request.getPart("image")
        val originalImage = ImageIO.read(imagePart.inputStream)

        val image = Randomiser.randomiseImage(originalImage)

        val scaleX = image.width / imageData.width
        val scaleY = image.height / imageData.height

        val g2d = image.graphics as Graphics2D

        when (mode) {
            "black" -> {
                // Black out ---------------------------------------------------------------------------------------------------
                g2d.color = Color.BLACK
                areas.forEach { area ->
                    g2d.fillRect((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
                }
                // -------------------------------------------------------------------------------------------------------------
            }
            "square" -> {
                // Rectangular mosaic ------------------------------------------------------------------------------------------
                val squaredImage = Pixeliser.squaredImage(image)
                areas.forEach { area ->
                    if (area.width > 0 && area.height > 0) {
                        val areaImage = squaredImage.getSubimage((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
                        g2d.drawImage(areaImage, (area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), null)
                    }
                }
                // -------------------------------------------------------------------------------------------------------------
            }
            else -> {
                // Only kill the meta data
            }
        }

        g2d.dispose()

        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        response.writer.append(imageString)
    }
}