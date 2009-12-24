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
import os
import unittest, doctest
from zope.app.testing.functional import ZCMLLayer


zojaxLoginPortlet = ZCMLLayer(
    os.path.join(os.path.split(__file__)[0], 'ftesting.zcml'),
        __name__, 'zojaxLoginPortlet', allow_teardown=True)


def test_suite():
    loginportlet = doctest.DocFileSuite(
        "loginportlet.txt",
        optionflags=doctest.ELLIPSIS|doctest.NORMALIZE_WHITESPACE)
    loginportlet.layer = zojaxLoginPortlet

    return unittest.TestSuite((loginportlet,))
