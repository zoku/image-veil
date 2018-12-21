package net.imageveil.app.utils

import java.io.IOException
import java.util.*

/**
 * Created by Manuel Helbing on 2018-12-06.
 */
class I18n(val locale: Locale) {
    val lang: String = locale.language

    private val dict = try {
        ResourceBundle.getBundle("i18n/app", locale)
    } catch (e: IOException) {
        ResourceBundle.getBundle("i18n/app", Locale("en"))
    }

    fun get(key: String, locale: Locale? = null): String {
        val useDict = if (locale == null) {
            dict
        } else {
            try {
                ResourceBundle.getBundle("i18n/app", locale)
            } catch (e: IOException) {
                ResourceBundle.getBundle("i18n/app", Locale("en"))
            }
        }

        return try {
            useDict.getString(key)
        } catch (e: MissingResourceException) {
            key
        }
    }
}