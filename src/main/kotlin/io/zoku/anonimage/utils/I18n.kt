package io.zoku.anonimage.utils

import java.util.*

/**
 * Created by Manuel Helbing on 2018-12-06.
 */
class I18n(locale: Locale) {
    private val dict = ResourceBundle.getBundle("i18n/app", locale)

    fun get(key: String): String {
        return try {
            dict.getString(key)
        } catch (e: MissingResourceException) {
            key
        }
    }
}