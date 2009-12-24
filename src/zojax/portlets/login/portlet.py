##############################################################################
#
# Copyright (c) 2009 Zope Foundation and Contributors.
# All Rights Reserved.
#
# This software is subject to the provisions of the Zope Public License,
# Version 2.1 (ZPL).  A copy of the ZPL should accompany this distribution.
# THIS SOFTWARE IS PROVIDED "AS IS" AND ANY AND ALL EXPRESS OR IMPLIED
# WARRANTIES ARE DISCLAIMED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF TITLE, MERCHANTABILITY, AGAINST INFRINGEMENT, AND FITNESS
# FOR A PARTICULAR PURPOSE.
#
##############################################################################
"""

$Id$
"""
from zope import interface
from zope.component import getUtility, getUtilitiesFor
from zope.component import queryUtility, queryMultiAdapter
from zope.app.security.interfaces import IAuthentication
from zope.app.security.interfaces import IUnauthenticatedPrincipal

from zope.app.component.hooks import getSite
from zope.app.component.interfaces import ISite
from zope.traversing.browser import absoluteURL

from zojax.controlpanel.interfaces import IConfiglet
from zojax.resourcepackage.library import include
from zojax.authentication.interfaces import ILoginService
from zojax.authentication.interfaces import IPluggableAuthentication
from zojax.authentication.interfaces import IDefaultCredentialsPlugin
from zojax.authentication.interfaces import ICredentialsPluginFactory

from interfaces import _, ILoginPortlet


class LoginPortlet(object):
    interface.implements(ILoginPortlet)

    nextURL = u''
    hasOpenId = False

    def update(self):
        self.portalurl = absoluteURL(getSite(), self.request)

        factory = queryUtility(
            ICredentialsPluginFactory, 'principal.users.credentials.openid')

        if factory is not None and factory.isActive():
            self.hasOpenId = True

    def isAvailable(self):
        request = self.request
        principal = request.principal

        if not IUnauthenticatedPrincipal.providedBy(principal):
            return False

        auth = getUtility(IAuthentication)
        login = queryMultiAdapter((auth, request), ILoginService)

        if login is not None:
            if login.isChallenging():
                return False

            if IPluggableAuthentication.providedBy(auth):
                for name, creds in auth.getCredentialsPlugins():
                    if IDefaultCredentialsPlugin.providedBy(creds):
                        self.nextURL = login.nextURL()

                        if self.hasOpenId:
                            include('portlet-login')

                        return True

        return False

    def getMailPassword(self):
        regtool = queryUtility(IConfiglet, name='principals.registration')
        if regtool is not None:
            return '%s/resetpassword.html'%self.portalurl

    def getJoinLink(self):
        configlet = queryUtility(IConfiglet, name='principals.registration')

        if configlet is not None:
            try:
                if configlet.getActions().next():
                    return '%s/join.html'%self.portalurl
            except:
                pass
