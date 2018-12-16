package io.zoku.imageveil.utils

import java.io.IOException
import java.util.*

/**
 * Created by Manuel Helbing on 2018-12-06.
 */
class I18n(locale: Locale) {
    private val dict = try {
        ResourceBundle.getBundle("i18n/app", locale)
    } catch (e: IOException) {
        ResourceBundle.getBundle("i18n/app", Locale("en"))
    }

    fun get(key: String): String {
        return try {
            dict.getString(key)
        } catch (e: MissingResourceException) {
            key
        }
    }

    fun get(key: String, locale: Locale): String {
        val tmpDict = try {
            ResourceBundle.getBundle("i18n/app", locale)
        } catch (e: IOException) {
            ResourceBundle.getBundle("i18n/app", Locale("en"))
        }

        return try {
            tmpDict.getString(key)
        } catch (e: MissingResourceException) {
            key
        }
    }
}