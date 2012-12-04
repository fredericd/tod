<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE stylesheet [<!ENTITY nbsp "&#160;" >]>
<xsl:stylesheet version="1.0"
  xmlns:marc="http://www.loc.gov/MARC21/slim"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  exclude-result-prefixes="marc">

  <xsl:output method="xml" indent="yes" encoding="UTF-8"/>
  
  <xsl:template match="record">
      <xsl:for-each select="datafield[@tag=245]">
        <dc:title>
          <xsl:for-each select="subfield">
            <xsl:value-of select="."/>
          </xsl:for-each>
        </dc:title>
      </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>
