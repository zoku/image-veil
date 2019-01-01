package net.imageveil.app.filters

import net.imageveil.app.utils.I18n
import java.util.*
import javax.servlet.*
import javax.servlet.annotation.WebFilter

@WebFilter(
        filterName = "LanguageFilter",
        servletNames = [ "Pages", "ImageVeilApp", "ErrorPage", "Contact", "Statistics" ]
)
class Language : Filter {
    override fun init(filterConfig: FilterConfig) {}
    override fun doFilter(request: ServletRequest, response: ServletResponse, chain: FilterChain) {
        val lang = request.getParameter("l") ?: request.locale.language

        val i18n = I18n(Locale(lang))

        request.setAttribute("i18n", i18n)
        response.locale = i18n.locale

        chain.doFilter(request, response)
    }
    override fun destroy() {}
}