package io.zoku

import com.google.gson.GsonBuilder
import io.zoku.model.Areas
import io.zoku.model.ImageData
import java.awt.Color
import java.awt.Graphics2D
import java.awt.image.BufferedImage
import java.io.File
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
        val imagePart = request.getPart("image")
        val image = ImageIO.read(imagePart.inputStream)

        val scaleX = image.width / imageData.width
        val scaleY = image.height / imageData.height

        val g2d = image.graphics as Graphics2D

        // Black out ---------------------------------------------------------------------------------------------------
        // g2d.color = Color.BLACK
        // areas.forEach { area ->
        //     g2d.fillRect((area.x * scaleX).roundToInt(), (area.y * scaleY).roundToInt(), (area.width * scaleX).roundToInt(), (area.height * scaleY).roundToInt())
        // }
        // -------------------------------------------------------------------------------------------------------------

        // Rectangular mosaic ------------------------------------------------------------------------------------------
        val squareLength = if (image.width > image.height) image.width / 100 else image.height / 100

        val squaredImage = BufferedImage(image.width, image.height, BufferedImage.TYPE_INT_RGB)

        for (sqX in 0 until squaredImage.width step squareLength) {
            for (sqY in 0 until squaredImage.height step squareLength) {

                var r = 0
                var g = 0
                var b = 0
                var pixels = 0
                for(imX in sqX until sqX + squareLength) {
                    if (imX > image.width) break

                    for(imY in sqY until sqY + squareLength) {
                        if (imY > image.height) break
                        val currentPixel = Color(image.getRGB(imX, imY))
                        r += currentPixel.red
                        g += currentPixel.green
                        b += currentPixel.blue
                        pixels++
                    }
                }
                val medianR = r / pixels
                val medianG = g / pixels
                val medianB = b / pixels

                g2d.color = Color(medianR, medianG, medianB)
                g2d.fillRect(sqX, sqY, squareLength, squareLength)
            }
        }

        g2d.drawImage(squaredImage, 0, 0, null)

        // -------------------------------------------------------------------------------------------------------------

        g2d.dispose()

        val baos = ByteArrayOutputStream()
        ImageIO.write(image, "JPEG", baos)

        val data = DatatypeConverter.printBase64Binary(baos.toByteArray())
        val imageString = "data:image/jpeg;base64,$data"

        response.writer.append(imageString)
    }
}