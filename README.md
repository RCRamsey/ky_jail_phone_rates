
# Topics & Objectives

<!-- TOC -->

  - [Part I. Visuals & Data Sources](#part-i-visuals-&-data-sources)
  - [Part II. Map Topic & Geographic Phenomena](#part-ii-topic-&-geographic-phenomena )
- [Part III. Objectives & User Needs](#part-iii-objectives-&-user-needs )
- [Part IV. Data Processing & Storage](#part-iv-data-processing-&-storage)
- [Part V. JS Libraries to Employ](#part-v-js-libraries-to-employ)
- [Part VI. Relevant Tech & Hosting Platform](#part-vi-relevant-tech-&-hosting-platform)
- [Part VII. Final Page Site](#part-vii-final-page-site)
<!-- /TOC -->

## Part I: Visuals & Data Sources 

**Visual 1**  
2018 Phone Rates Map  
*Source*  
 - https://www.prisonpolicy.org/phones/appendix_table_2.html
 
*Description*  
Data for phone rates (1st minute, every additional minute, avg for 15 minute phone call instate) from 32 county Jails of Kentucky.  
Data can be found in the *data/ky_jail_prison_by_county.csv*


**Visual 2 & 3**  
WMMT location marked and a circle radius demonstrating all incarceration facilities it reaches with its show and a video about *Calls from Home*.  
*Sources*  
- https://www.wmmt.org/callsfromhome/  
- https://vimeo.com/44433312
- https://www.youtube.com/watch?v=RUUAOyA_SCo

*Description*  
A demonstration of the current state of affairs for some families. Credit given to WMMT and the individual/organization(s) Field Studio who filmed/posted the interview of the *Calls from Home* show.

**Visual 4**
Line graph of conviction rate for those housed in KY jail facilities since 1978.  
*Source*
- https://www.prisonpolicy.org/profiles/KY.html

*Description*
Line graph demonstrates how over time, the pre-trial population (those in jail and not yet convicted or considered guilty of anything) has more than doubled since 1978. Thus, those considered innocent until proven guilty are still being punished through phone call fees and rates. Credit given to prisonpolicy.org as it is their data compilation and figure.

**Visual 5**  
Line graph of Phone rates over time comparing prisons and jails based on 15 minute phone call (2008-2018)  
*Source*  
- https://www.prisonpolicy.org/phones/state_of_phone_justice.html

*Description*  
Comparison of phone rates between prisons and jails based on 15 minute phone call from 2008-2018 to demonstrate that since FCC set caps in prisons their rates plummeted and yet Jails are still quite high. Credit given to prisonpolicy.org as it is their data compilation and figure.

**Visual 6**  
How many Residents of KY locked up and where by facility type (pie chart 2018)  
*Source*  
- https://www.prisonpolicy.org/profiles/KY.html

*Description*  
Pie chart to demonstrate shear number of Kentucky residents locked up at one time within Kentucky (local jail, state prison, federal prison). Credit given to prisonpolicy.org as it is their data compilation and figure.
       
**Visual 7**  
Choropleth counties urban vs. rural county  
*Source*  
Urban vs Rural Data from National Center for Health Statistics & Centers for Disease Control (2013)
- https://www.cdc.gov/nchs/data_access/urban_rural.htm#Data_Files_and_Documentation  

*Description*  
The original data was for counties nationwide. Pulled KY counties from this data using the same 6 designations of 1 Large Central Metro (inner city) 2 Large Fringe Metro (suburban) 3 Medium Metro 4 Small Metro 5 Micropolitan 6 Non-core. This demonstrates the  isolation of the locations and burden placed on a person to travel (distance to cover with or without a vehicle) and meet the incarcerated person face to face as opposed to using the phone.
Data can be found *data/2013_urban_rural.csv* 

**Visual 8**  
Point map of locations of all prison and jails of KY   
*Sources*   
- Federal Prisons pulled from POI (2020): http://www.poi-factory.com/node/24953   
- KY Jails layer created (2021) by
searching online for each county in KY listed as having an open facility based on the figure in https://corrections.ky.gov/Facilities/Documents/Local%20Facilities/Jail%20Classifications%2003-31-21.pdf  
- Terms used for online search of jails by county include: detention; correction; jail.  
- Physical addresses revealed upon internet search were pulled from their respective websites and geolocated. If no website exhists, internet search used to search by county.

*Description*  
KY map with points to demonstrate the numerous facilities across KY and their captive market.  
Data can be found *data/ky_jail_prison_by_county.csv* 
       

**Visual 9**  
Choropleth map showing % of county population incarcerated  
*Sources*  
- Population of county census (2019) https://www.census.gov/search-results.html?searchType=web&cssp=SERP&q=population%20county%20ky
- Population of county incarcerated by county in jail (updated weekly and pulled most recent May 2021) https://corrections.ky.gov/About/researchandstats/Pages/weeklyjail.aspx  

*Description*  
math=(pop of jail / county pop)*100
Map demonstrating the percentage of the county population counted as being incarcerated as of look up date. Regardless of how forms are filled out, census assigns incarcerated people to the address of the jail. Demonstrates how much of a county is subject to these phone rates.
Data can be found *data/2019_pop_est_county_ky.csv* & *data/incarc_pop_cnty_may_2021_sum.csv*


## Part II: Topic & Geographic Phenomena 


During the age of unlimited call/text plans, rates and fees still apply for the incarcerated and their loved ones. This project explores the rates for a 15 minute phone call from 32 Kentucky county jails and the associated impact that poses on parties involved. 

**Title** Rates & Fees Apply  
**Sub-title** 2018 Kentucky County Phone Rates from Jail

## Part III: Objectives & User Needs
The stated end goal of most incarceration facilities is the successful permanent reintegration of their members back into society as responsible citizens and yet their members are expected to accomplish this despite having limited to no connection to the community they are returning to. This map's objective is meant to lay bare the blatant roadblocks incarceration facilities construct in preventing this end goal and continuing the cycle of re-incarceration of vulnerable populations.

An example User scenario:  
Chris, a high school civics teacher has a 30 year old sister named Erica and a nephew (Erica's son). Erica lost her full time job as a waitress during the Coronavirus pandemic. During this time her motor vehicle insurance expired and she had to choose between paying it and paying for groceries. She continued driving to drop her son off with Chris (teaching virtually) while job hunting and was pulled over for a darkened tail light. She received a traffic ticket for lack of car insurance but since she still hasn't found a job she never has spare cash to pay the ticket ($250). She was later arrested and placed in jail until her court date. Chris waits until late at night concerned that his sister hasn't picked up his nephew yet.

Erica attempts to call Chris, to inform him of the situation, ask if he could take care of her son long term and hire an attorney.
When Chris first answers the phone an automated voice says, 

"You have a phone call from an inmate at Henderson County Jail. Our records show you don't have an account or enough funds to complete this call. To pay for just this call using your credit or debit card press 1" he presses 1. "This call will cost $3.32 for the first minute and $0.52 for each additional minute plus any additional federal, state, and local taxes. Plus a one time transaction fee of $3.00" 

Chris finds out what's going on and tries to calm Erica. He says he'll take care of her son and track down an attorney. She sits in jail because of backed up court systems for four weeks. She calls every day to talk to her scared son or ask Chris about the attorney. The first week Chris answers every time until he sees his first phone bill, 5 phone calls costed almost $100. One day he misses a call while at work. He went to listen to the voicemail she left and had to pay $7 to hear it. The second week he declines her call to listen to more menu options. This is when he finds he can create an account to avoid one time fees. Chris and Erica's uncle Joseph said he'd add some funds to the account as he knew Chris was strapped for cash taking care of Erica's son and paying the attorney. Unfortunately Joseph who lived paycheck to paycheck, didn't have a bank account so he used WesternUnion to add money to the account. WesternUnion charged him $11.95 fee to add the minimum amount of $25. 

Erica returns home after 60 days in jail, with fines, court fees, jail fees and partial attorney fees. Living outside of the city she must drive in to town for work once again, and gets pulled over for rolling through a stop sign. Another traffic ticket is doled out because she still hasn't had enough money yet to pay off all the fees and her car insurance. The cycle begins again.

Chris becomes fed up having thought this was going to be a one time blip in Erica's history. He researches online to see if all jails have this same fee system or just his. He finds my map site.

- The proportionally set radius circles (based on a 15 minute phone call) at first glance informs him how his county is one of the most expensive. The circles also inform him that his county is not alone. This is confirmed by the circle's color indicating the phone rates are 1.5x greater than the states overall average for 32 counties.
- He thinks about all the other families impacted the same way he has. Some even rely upon a radio show to communicate with their loved ones. He *compares* a radio station's broadcast reach to incarceration facilities in a secondary map, employing the link to see an enlarged view.
- He views a graph explaining how Erica is not alone in being subject to all of the phone calls despite not being convicted yet. 
- He views a graph that shows people in prisons (already found guilty) have lower phone rates (thanks to the FCC caps) than his sister who has to wait until her court date for sentencing.
- He views a graphs that shows almost a 3rd of the incarcerated of Kentucky are in local jails. 
- In a secondary map, he *associates* the relationship between incarceration facilities existing in a rural county and the hardship this poses for meeting face to face encouraging persons to utilize the phone system.
- On a secondary map, he *associates* the shear number of incarceration facilities in KY Finding them to be unbelievable; a literal captive market.
- In a secondary map he *identifies* the % of county populations actually incarcerated and how many people in a county are subject to these rates and fees.

Chris concludes it's a pervasive problem. So he uses the internet to find
contact links for his state legislature and starts writing emails with documentation from my site and asks them to work with contracting authorities, public utilities commissions, the FCC and Congress to battle the unfair treatment.

He also knows if he wants anything to change faster it has to start local and begins with the next local election for the county Jailer and wants to know his stance on the predatory contracts and kickbacks he learned about from this map.

 ## Part IV: Data Processing & Storage  
 All csv data files and geojson's used to create the maps available for download in the associated data folder.

 **Visual 1 2018 Phone Rates Map**
 Data compiled into a single csv no additional processing necessary besides dynamically in landing page creation.

 **Visuals 2-3**
 Geolocated facilities reached by WMMT Radio station for its "Calls from Home" program in QGIS 3.16 and exported png saved in graphics folder to load during landing page creation. A still png from documentary youtube video saved in graphics folder and click event connected to redirect to youtube video.

 **Visuals 4-6**
 Are images that downloaded and stored in a graphics folder to load during landing page creation.

**Visual 7**
Data pulled from single csv and joined by county FIPS code in QGIS 3.16. Jail location layer added. Exported and stored in graphics folder to load during landing page creation.

**Visual 8**
Data pulled from single csv and county layer in QGIS 3.16. Exported and stored in graphics folder to load during landing page creation.

**Visual 9**
Data pulled from single csv and joined by county FIPS code in QGIS 3.16. Jail location layer added. Exported and stored in graphics folder to load during landing page creation. 

## Part V: JS Libraries to Employ
Entire landing page employs *bootstrap* framework.  
The phone call rates map data is stored and loaded as csv (to reduce file size) transformed into a geoJSON using omnivore then presented as a mapbox map manipulated through leaflet, with assorted vanilla java script and chroma.

Libraries necessary
**Visual 1 2018 Phone Rates Map**
Omnivore to load csv data as geoJSON, assembly.css for additional styling and use jquery/vanilla js for remainder of interactions (listen for interactions, select DOM elements, UI changes).
  <script src="https://code.jquery.com/jquery-3.5.1.min.js"
        integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
 <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"
        integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous">
    </script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.min.js"
        integrity="sha384-Atwg2Pkwv9vp0ygtn1JAojH0nYbwNJLPhwyoVbhoPwBhjQPR5VtM2+xf0Uwh9KtT" crossorigin="anonymous">
    </script>
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script> 
<script src='https://api.tiles.mapbox.com/mapbox.js/plugins/leaflet-omnivore/v0.3.1/leaflet-omnivore.min.js'>
    </script>

**Visuals 2-9**
No additional libraries required.

**Header timer vs phone call rate**
Made a jQuery count up timer using vanilla jQuery and math to display cost based on an incarceration facility's phone rates.
 
## Part VI: Relevant Tech & Hosting Platform
Entire project to be contained on a single landing page using HTML, assembly.css, CSS and hosted on Githubpages

## Part VII: Final Page site
rcramsey.github.io/ky_jail_phone_rates/

Visit my portfolio here: https://rcramsey.github.io/