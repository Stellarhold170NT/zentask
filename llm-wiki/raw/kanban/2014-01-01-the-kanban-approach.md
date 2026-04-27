# Source: The kanban approach, between agility and leanness: a systematic review
Collected: 2026-04-27
Published: 2014-01-01
---
Empir Software Eng
DOI 10.1007/s10664-014-9340-x

The kanban approach, between agility and leanness:
a systematic review

Osama Al-Baik & James Miller

# Springer Science+Business Media New York 2014

Abstract The interest in lean product development in general and the Kanban approach in
particular has increased over the years. However, practitioners, in the software development
field, have significant challenges in implementing the Kanban approach as it lacks a clear
definition of its principles, practices, techniques and tools. This study aims to provide insight
into the Kanban approach and its elements (concepts, principles, practices, techniques, and
tools) that have been empirically reported by scholars and practitioners. This insight is
produced by using the systematic review method to analyze the available literature. A total
of 37 primary studies were selected from more than 3,000 unique studies. Our findings show
that the primary studies have considered and reported 20 different elements as part of the
Kanban approach based upon considerations of being an agile approach or a lean principle;
these elements have realized great benefits and improvements to the software development
teams. These benefits along with the challenges have been reported in this study. Due to the
variety of organization types, contexts, and project sizes reported in the primary studies, it is
expected that the results in this study would help in establishing knowledge on what are the
different elements of the Kanban approach as well as offering a first step towards developing
guidelines for practitioners to help in introducing the Kanban approach to software develop-
ment organizations.

Keywords Kanban . Lean . Agile . Software development . Software engineering . Process
improvement . Systematic review

1 Introduction

In recent years, the lean approach to software development and its concepts have become
increasingly popular. The lean approach was first applied in the manufacturing industry. It was
devised at Toyota and was originally called the Toyota Production System (TPS). The aim of

Communicated by: Laurie Williams
O. Al-Baik : J. Miller (*)
Department of Electrical & Computer Engineering, University of Alberta, Edmonton, AB, Canada
e-mail: jm@ee.ualberta.ca

O. Al-Baik
e-mail: albaik@ualberta.ca

Empir Software Eng

the lean approach is to deliver value to customers more effectively and efficiently through the
process of finding and eliminating waste, which is a huge impediment to the productivity and
quality offered by an organization (Liker and Hoseus 2008; Magee 2008).

One of the most popular principles of the lean approach is kanban, which is a tool for
controlling the logistical chain from a production point of view and is a method by which just-
in-time (JIT) is achieved (Ohno 1988). Kanban is one of the two pillars in the lean house that
was developed by Toyota. Since 2003, David Anderson (2010) has attempted to tailor the
Kanban system to software development, formulating the Kanban method, which applies
incremental, evolutionary process and systems changes in organizations.

Anderson differentiates the Kanban method from kanban—the pull system—by capitaliz-
ing the word Kanban. He identifies five elements to the successful implementation of the
Kanban method: 1) visualize the workflow, 2) limit work-in-progress (WIP), 3) manage flow,
4) make policies explicit, and 5) implement feedback loops. Anderson’s contribution to
establishing a comprehensive Kanban approach is evident; however, the approach is not based
upon a well-defined framework and therefore needs further development.

The purpose of this research study is to illuminate the guiding principles and elements of
the Kanban approach. The objective is to increase the likelihood of implementing the Kanban
approach successfully to software product development by 1) Defining the prime elements of
the Kanban approach, and 2) Outlining the benefits and drawbacks of using the Kanban
approach to help IT organizations as they decide whether to apply the approach.

The findings of this systematic literature review were derived from 37 primary studies
that were selected per the research scope. An analysis of these studies showed that they
can be classified into four main categories: 1) Kanban as an element of lean (beyond
agile), 2) Kanban as an agile methodology, 3) Hybrid of Kanban and Scrum, and 4)
Explanatory Kanban. Each classification identifies several sets of elements related to the
Kanban approach that scholars in different categories—and sometimes within the same
category—have adopted. The existence of multiple sets of elements added another
dimension to the difficulty of establishing a common understanding and a clear definition
of the Kanban approach among practitioners.

Furthermore, based on the findings of this review, the investigators propose areas that
require further analysis and investigations. This will ensure that software development orga-
nizations are well informed regarding all that is involved in applying the Kanban approach to
their software development processes.

The paper is organized as follows: Section 2 provides background related to the research
area and emphasizes the differences between this systematic review and previous systematic
reviews in the domain. Section 3 outlines the research methodology by way of a systematic
review. The results of the study are given in Section 4, together with their analysis. Section 5
presents a discussion of the study, including proposed guidelines to implement the Kanban
approach and threats to the study's validity, while Section 6 covers conclusions as well as
recommendations for extending the research study.

2 Problem Statement and Scope

The value that the lean approach has brought to the manufacturing industries has inspired
scholars and practitioners in the software engineering domain to begin exploring and
implementing the lean concepts and principles to the software development process. In
2003, Poppendieck and Poppendieck (2003) wrote the first book on lean principles to software
development. They proposed key elements of lean principles and outlined the challenges to

Empir Software Eng

implement the lean approach successfully in IT organizations. The main challenge has been
related to the underlying changes to the organization culture that the lean thinking brings to an
organization.

Poppendieck and Poppendieck (2003), on the other hand, claimed that understanding lean
thinking has helped IT organizations to achieve sustainable performance improvement. How-
ever, Shah and Ward (2007) questioned the level of understanding possessed by scholars of
lean thinking in the software engineering domain. The hypothesis is that practitioners are
usually simulating practices of proven approaches from other disciplines or industries to
software development, where as these practices are typically context-dependent and should
be different from one setting to another. Instead, practitioners and scholars should understand
the underlying principles in order to develop best practices around the application strategies of
these principles (Poppendieck and Poppendieck 2003; Wang et al. 2012; Al-Baik and Miller
2014).

Although the Kanban approach has been further developed in the past few years, no
specific practices for its implementation exist, as illustrated by the different perceptions held
among scholars about the approach itself. This has created the need for more study and
analysis. The Kanban approach fundamentally depends on the lean principles that have been
developed over the past 60 years; yet even these principles have no pure definitions in the
literature available on the subject (Shah and Ward 2007; Al-Baik and Miller 2014). For
instance, Womack and Jones (2003) mention only 5 principles, while Liker (2004) holds that
there are 14 principles.

Wang et al. (2012) put credible efforts into identifying the lean concepts, principles, and
practices, in which they, on one hand, identified five principles related to the Kanban approach
based around Anderson’s definition of the Kanban method. On the other hand, they identified
a set of practices related to implementing these principles to software development. The
application strategies of Kanban to software product development are defined as practices to
implement the principle in specific settings. That is, a context-dependent implementation
should differ from implementations in the manufacturing setting.

This study began as an attempt to shed some light on the practices involved in
implementing the Kanban approach to software product development. The results of this study
are expected to help establish knowledge of the different elements of the Kanban approach.
The study also attempts to offer a first step towards developing guidelines for practitioners to
use when implementing the Kanban approach in software development organizations.

Anderson’s initiative has created a growing interest in the Kanban approach and how it can
be implemented and set up in the IT industry. Even though kanban has been used for many
years by Toyota in the TPS, the concept is relatively new in IT and still requires considerable
study and investigation (Womack and Jones 2003). As a result, many IT organizations have
been shying away from its use, while those who are using Kanban continue to struggle with
the challenges the approach presents.

The scope of this review is specific to the implementation of the Kanban approach for
product development processes in software development. In an attempt to develop a compre-
hensive Kanban approach, the investigators therefore define the Kanban approach as the
following: a set of concepts, principles, practices, techniques, and tools for managing the
product development process with an emphasis on the continual delivery of value to cus-
tomers, while promoting ongoing learning and continuous improvements.

The scope and coverage of this systematic review differ significantly from previous
reviews. For example, Dybå and Dingsøyr (2008) performed a systematic literature review
of various empirical studies conducted on agile methods and lean software development up to
the year 2005, and they were able to identify 36 relevant studies. Of those 36 studies, only a

Empir Software Eng

single study reported on the application of lean practices to software development. They
also found that these empirical studies focused on only one development method such as XP.
Furthermore, the implementation of the lean approach was only carried out on a small scale
with only three papers investigating organizations with more than 50 employees.

Another systematic review conducted by Wang et al. (2012) was limited to experience reports
that had been published in agile-related conferences between 2000 and 2011. The scope of
Wang’s review was very wide and generic; it investigated the application strategies of more than
30 lean concepts, practices, and principles in agile software development. The review illustrated
that organizations were mainly focusing on two lean concepts, “value” and “eliminating waste.”
Wang et al. (2012) reported that organizations were moving from agile processes to lean
processes, and this shift has led Wang to commend the development of operational guidance
for each specific lean process, which was suggested as a significant area for future research and
investigation. In short, Wang et al. (2012) do not specifically address the question of “What is
Kanban?” in any detail. Table 1 emphasizes the differences between this systematic
review given in this paper and the Wang et al. (2012) systematic review:

The results have been analyzed using the broad lean perspective, which relates to lean
product development rather than lean software development. The systematic review approach
of this study will also provide software development teams with an assessment of the
methodological quality, and the strength of the evidence provided will deliver the necessary
information prior to Kanban adoption.

3 Research Methodology

This research study has been undertaken by following the guidelines produced by Kitchenham
and Charters (2007). The study has been conducted in three phases, 1) Planning the review, 2)
Conducting the review, and 3) Reporting the review. Each phase has specific steps and
outcomes, these steps and outcomes, specific to this research, are outlined in Table 2.

Table 1 Comparison with Wang et al. (2012)

Comparison
element

The Kanban Systematic Review
Al-Baik and Miller (2014)

Leagile Systematic Review
Wang et al. (2012)

Purpose

1. Illuminating the guiding principles

and elements of the Kanban approach
to increase the likelihood of
implementing it successfully by:
2. Defining the prime elements of the

Kanban approach, and

3. Outlining the benefits and challenges

of using the approach within IT organizations.

Years included

Scope

1990–2012
Specific to the Kanban approach

1. “Providing a better understanding
of the application strategies of lean
approaches in agile software
development, and

2. Demonstrating how these strategies
are being implemented in practice”
Wang et al. (2012, p. 1288).

2000–2011
More than 30 different lean concepts,

principles, and practices

Sources of primary

studies

Journal articles, and Grey Literature, including
conference proceedings and digital libraries
Scopus, Scirus, Google Scholar, ACM Digital

Limited to experience reports that were
published in agile-related conferences

“XP Conference series, Agile

Library, IEEE Xplore, Science Direct
(Elsevier), Web of Science, InterScience
(Wiley), Science.gov, and InfoQ.com

Conference series, and XP/Agile
Universe series” Wang et al. (2012)

Empir Software Eng

Table 2 Steps and Artifacts of Systematic Literature Review

Phase

Steps

Artifact Outcomes

Planning Phase

- Identifying the objectives of the review

- Review Protocol document

- Formulating the research questions

- Data Extraction Form

- Developing and Evaluating the review protocol

Conducting Phase

- Developing a search strategy and search strings
- Identify sources of primary studies

- Search Strategy document
- Quality Instrument

- Assessing quality of, and selecting, primary studies

- Data Extraction form (revised)

- Extracting data from the selected primary studies

- Result summary

- Synthesizing the extracted data

Reporting Phase

- Presenting the results

- Systematic Review report

- Writing and formatting the systematic review

- Evaluating the systematic review

3.1 Objectives of Systematic Literature Review

The purpose of this paper is to illuminate the guiding principles and elements of the Kanban
approach to increase the likelihood of implementing it successfully by defining the prime
elements of Kanban and outlining the advantages and benefits of using it within IT organiza-
tions. The paper uses a systematic review methodology to look at the associated literature on the
Kanban approach and its application in industrial I.T. settings. There is a need to empirically
show the advantages that the Kanban approach can bring to IT organizations, which may
increase confidence in the approach that in turn may lead to its wider adoption.

As recommended by Kitchenham and Charters (2007), the research group has framed the
research questions based upon Petticrew and Roberts’s (2006) criteria (Population, Interven-
tion, Comparison, Outcomes, and Context) PICOC. The population for our study is the
application area, of the Kanban approach, that is the IT settings for software product devel-
opment; the intervention for this research is the implementation of the Kanban approach in
software product development, while the main comparison is with agile methodologies in
general and Scrum in particular.

The outcome of this study aims to illuminate the guiding principles to implement the
Kanban approach in IT organizations to reduce both, cost and product’s cycle-time, while
increasing both, product quality and customer satisfaction. The context of this study targets
industrial IT settings for software product development without a restriction on the size. The
industrial settings might not be a full empirical study in one particular organization or project;
for instance, Poppendieck and Poppendieck (2003) use several examples from diverse projects
in different organizations throughout their book. The primary questions of this study are as
follows:

RQ.1. What elements of the Kanban approach are being discussed by the available literature

as providing evidence of perceived benefits?

RQ.2. What are the perceived benefits and challenges of using the Kanban approach,

according to the available literature?

RQ.3. Are the established guiding principles of the Kanban elements by the available

literature well defined and applicable?

RQ.4. Are agile techniques being relabeled as elements of the Kanban approach?

Empir Software Eng

The first research question seeks to investigate Kanban’s primary elements that the past

studies have covered. It answers the following questions:

RQ 1.1 What are the prime elements of the Kanban approach that have been discussed by the

available literature?

RQ 1.2 What are the relationships between the Kanban prime elements and the five core

pillars of lean thinking?

Womack and Jones (2003) defined the five core pillars of lean thinking as:

1) Value: specifically the value from the customer’s point of view, and value should be

expressed in terms of a specific product or service.

2) Value Stream: identify the set of actions or steps required to transform the value from

concept into finished product or service in the customer’s hand.

3) Flow: once the value stream is well specified, and the wastefulness steps have been

eliminated, make the value adding actions, or steps, flow without interruption or delay.

4) Pull: when flow is realized, a period time required to transform a concept into a finished
value (product or service). Hence, the value has to be only introduced per the customer’s
demand. The value stream is triggered when the customer pulls the value when needed.
5) Perfection: when an organization implements the previous four principles, it realizes that

there is no end for continuous improvement to seek perfection.

The second research question (RQ.2) seeks to investigate the perceived benefits and

challenges that the available studies have reported. It answers the following questions:

RQ 2.1 What are the perceived benefits of using the Kanban approach, according to the

available literature?

RQ 2.2 What are the perceived challenges of using the Kanban approach, according to the

available literature?

The third research question (RQ.3) investigates the clarity and applicability of the
established guiding principles as they have been undertaken by past studies to lead the Kanban
initiatives in IT organizations. It answers the following question:

RQ 3.1 Have the practitioners and scholars distinguished between the Kanban (capital K)
method as a comprehensive change catalyst for software development and the
kanban system (small k) as a pull system?

Finally, the fourth research question (RQ.4) assesses the relevance of results that have been
reported in the past studies by examining whether the agile-related techniques were just
relabeled as being the Kanban techniques. It considers the following question:

RQ 4.1 Are Scrum boards being relabeled as Kanban boards?

3.2 Search for Primary Studies

In an attempt to perform a comprehensive scholarly and scientific search, and to minimize the
bias into this systematic review, the search for primary studies was not only limited to

Empir Software Eng

published journal article, but also targeted Grey Literature, including conference proceedings,
digital libraries, and theses as recommended by York University, Centre for Reviews and
Dissemination (CRD) Database of Abstract of Review of Effects (DARE).

The research has a planned systematic approach and specific sources to search for the grey
literature to overcome the difficulties associated with finding articles to make it easier for the
reader to verify the resources used in this research. The research contributions are limited from
the year 1990 onwards, as Womack, Jones, and Roos (1990) introduced the concept of Lean in
1990. The search was only applied to abstracts, keywords and titles.

3.2.1 Sources of Primary Studies

As recommended by Kitchenham and Charters (2007), a combination of electronic search and
manual search was conducted to minimize the threat of missing relevant studies. The Kanban
approach and Lean have been used by IT organizations in different business domains, including
but not limited to: IT Retailing, IT consulting, IT Quality Management, Software Development
and Information Technology; thus, the related studies may be located in any IT related source or
digital library; hence, the need has become apparent to search different electronic sources and
digital libraries as there is no one authoritative source covering all the IT fields.

In an attempt to cover as many related sources as possible, the search covers the digital
libraries and data sources as recommended by Brereton et al. (2007) in Kitchenham and
Charters (2007). Table 3 provides a list of sources, which have been electronically searched to
find primary studies, as well as the rationale behind searching each source.

Specific journals, such as “Empirical Software Engineering”, “The Journal of Systems and
Software” and “The Information and Software Technology Journal”, were searched manually,
as they are known to have either empirical studies or literature reviews and have been used by
other Software Engineering systematic reviews. The full list of the manually searched journals
and conference proceedings has been declared in the research protocol.

3.2.2 Search Strings

A list of terms was created earlier during the development of the research protocol; the list has
been used to develop the search strings. The terms have been combined using the Boolean
expressions (AND, OR) while being searched so as to reduce the number of irrelevant results
that might not relate to the research area. That is, Google Scholar returned 32,200 results for
searching (Kanban), 15,400 results for (Kanban AND Software) and 2,290 results for (Kanban
AND “Software Development”). This is due to the fact that individually, the terms are also
applicable to other disciplines.

The search strings were constructed based upon the structured research questions by
following the PICOC method (see section 2.1), major synonyms for each element were
combined using the Boolean expression OR, then the final research string was assembled
using the Boolean expression AND as shown in Table 4.

The strategy for constructing the search strings was unified regardless of literature type,
(Monographic Literature, Grey Literature, or Systematic Literature Review); however, the
search terms were not the same. For instance, the context to search for primary studies in the
monographic literature was composed of alternative terms to IT industrial settings or empirical
evidence; however, the context to locate systematic reviews was composed of synonyms given
to the systematic review as defined by Biolchini et al. (2005). The investigators have also
reviewed the cited resources in the primary studies and reviewed these citations to include the
studies that satisfy the inclusion criteria within the scope of the research area.

Table 3 Sources of Primary Studies

Empir Software Eng

Source

Scopus

Scirus

Google Scholar

Rationale

Literature Type

Claims to be the world’s largest database of abstracts and

Monographic, Grey

citations, with 49 million records including 5.3 conference
papers

Claims to be the most comprehensive scientific search tool,
with 545 million items including repositories and web
information

Indexes the text of scholarly literature across many disciplines
and sources. It covers theses, books, and publications from
professional societies and online repositories

Monographic, Grey

Monographic, Grey

Monographic

ACM Digital Library Claims to be the world’s largest education and scientific
computing society, it covers books, periodicals, reports
and theses

IEEE Xplore

A major resource for scientific and technical content. It claims

Monographic

that it expands its database by 25,000 new documents
each month

Science Direct
(Elsevier)

Claims to contain more than 11 million full text articles

Monographic

of more than 2,500 journals and 11,000 books

Web of Science

Provides access to cross disciplines and multiple databases.

Monographic

It provides a citation index to reference any other literature
referencing the work of the searched study.

InterScience (Wiley) Claims to be the largest publisher for professional and scholarly
societies. Provides access to over 4 million articles from 1,500
journals, 9,000 books, and reference works and databases.

Monographic

Science.gov

InfoQ

A gateway to over 2,100 scientific websites, provides search of
over 55 scientific databases and 200 million pages of science
information and research results

An online practitioner-driven community providing news, articles,
presentations, and interviews to spread the knowledge and
innovation in the software development community

Grey

Grey

3.3 Selection of Primary Studies

The selection of candidate primary studies was derived from the inclusion criteria that had
been defined in the research protocol. Due to the enormous number of candidate studies and
the limited time and resources available, the screening process consisted of three main steps.
First, depending on the inclusion criteria as the solely determinant to weather to include or to
exclude the paper, the authors screened the titles and keywords to determine the relevance to
the study area. In case of uncertainties, the second step would be triggered, which involved
screening the abstract of the paper, after which the investigators included or excluded the
paper. If doubt still existed, step three would be carried out, reading the introduction and
conclusion of the paper, then the investigators included or excluded the paper. The selection
process that was followed is illustrated in Fig. 1.

3.3.1 Inclusion and Exclusion Criteria

For the purpose of this research study, exclusion criteria have not been established, the only
exclusion criterion was “If the study does not meet the inclusion criteria, it must be excluded”,
the following inclusion criteria have been established for this study:

Empir Software Eng

Table 4 Search Strings

Element

Monographic

Systematic Literature

Population

“Software engineering” OR “Software

development” OR “Information technology”
OR “Computer science” OR “IT project
management” OR “Software project
management” OR “Information technology
project management” OR “Software product
development” OR “IT Product development”

“Software engineering” OR “Software

development” OR “Information technology”
OR “Computer science” OR “IT project
management” OR “Software project
management” OR “Information technology
project management” OR “Software product
development” OR “IT Product development”

Intervention Kanban OR Lean OR “Continuous flow” OR
“Pull system” OR “Lead time” OR “Cycle
time” OR “Work in progress” OR “Work in
process” OR WIP

Comparison Agile OR Agility OR Scrum OR Leagile OR

Outcome

Context

Scrumban

“Process improvement” OR “Cost reduction”

OR “Reducing Cost” OR “Reduce cost” OR
“High quality” OR “Higher quality” OR
“Quality improvement” OR “Improving
quality” OR “Improve quality”

Empirical OR Experiment OR “Evidence

based” OR “Industrial setting” OR “Case
study” OR “Action research”

Kanban OR Lean OR “Continuous flow”
OR “Pull system” OR “Lead time” OR
“Cycle time” OR “Work in progress” OR
“Work in process” OR WIP
Agile OR Agility OR Scrum OR

Leagile OR Scrumban

“Process improvement” OR “Cost reduction”
OR “Reducing Cost” OR “Reduce cost”
OR “High quality” OR “Higher quality”
OR “Quality improvement” OR “Improving
quality” OR “Improve quality”
“Literature Review” OR Overview OR
“Research review” OR “Research
synthesis” OR “Research integration”
OR “Systematic review” OR “Integrative
research review” OR “Integrative review”

& The study should be written in English.
& The study should be published between 1990 and 2012.
& The study should include empirical evidences derived from industrial settings, regardless

of research methodology espoused in the study, i.e. exploratory or explanatory.

& The study should clearly state that it has its focus on software product development

through the use of the Kanban approach or lean.

& The study should describe the elements and the approach used to implement Kanban.
&

If the study has been published in more than one journal/conference, the most recent
version of the study has to be included.

3.3.2 Study Quality Assessment

Each of the studies that had been selected previously was subjected to a full quality
assessment process; the quality assessment process was developed to accommodate the three
types of literature covered by this study; monographic literature, systematic literature review,
and grey literature. As recommended by Kitchenham and Charters (2007), the research
investigators developed a quality instrument to be the basis for the quality assessment
(Appendix 2 describes the instrument).

Monographic quality was assessed by investigating the study’s rigor and relevance using
the guidelines proposed by Ivarsson and Gorschek (2010), while systematic literature review
was assessed as per the criteria proposed by York University, Centre for Reviews and
Dissemination (CRD) Database of Abstract of Review of Effects (DARE). As there are no
clear criteria to assess the quality of the grey literature, the investigators followed a systematic

Empir Software Eng

Fig. 1 Selection Process of Primary Studies

approach to assess the quality using two attributes: 1) the number of citation and 2) the h-index
of the author(s). The studies that had not succeeded to meet a minimum level of quality
threshold were excluded (see Appendix 3 for the list of excluded papers).

3.3.3 Reliability of Inclusion Decisions

Two research investigators have conducted the research study; hence, dispute and disagree-
ment to include primary studies has occurred. The dispute between the investigators has been
addressed scientifically by adhering to, and following, the primary study selection process
presented in Fig. 1. Agreements between the investigators have been measured using Cohen’s
Kappa (k) method to estimate the interrater reliability (Banerjee, Capozzoli, McSweeney, and
Sinha 1999). Scholars have not determined the level of interrater reliability that must be
reached to consider the reliability measurement acceptable. Banerjee et al. (1999), however,
suggested that for the interpretation of kappa values

For most purposes, values greater than 0.75 or so may be taken to represent excellent
agreement beyond chance… and values between 0.40 and 0.75 may be taken to
represent fair to good agreement (Banerjee et al. 1999, p. 604)

Empir Software Eng

Hence, the research investigators decided to adopt the rigorous requirements of achieving
greater than 0.75 on Kappa’s measurements. The inclusion criteria were pretested twice, after
first pretest, the inclusion criteria were revised and the pretest was conducted again on the
same studies to assess the clarity of the inclusion criteria. The interrater reliability has been
increased by 20 percent as a result of resolving one disagreement between the research
investigators. After the second pretest, the criteria have been considered to be adequately
reliable to proceed further. Table 5 shows the results of interrater reliability estimations.

3.4 Data Extraction

The data extraction stage aims to design the extraction form, which helps the research
investigators to report the information that they will gain from the primary studies to answer
the research questions. In an attempt to reduce the bias and as recommended by Kitchenham
and Charters (2007), the extraction form has been defined and piloted during the planning the
review phase as part of the systematic review protocol. The pilot process has not only helped in
reducing the bias, but also, has given the investigators a chance to familiarize themselves with
the data extraction process and to revise the form as required.

3.4.1 Data Extraction Procedures

The research investigators applied multiple data extraction methods to ensure the data extrac-
tion consistency. The methods were test-retest and cross checking, in which the primary
investigator and the coauthor, respectively, performed a second extraction, and crosschecked
twelve randomly selected primary studies. After applying the inclusion criteria on more than
3,000 studies, the candidate studies for inclusion had been reduced to 54 studies that went
through the quality assessment process (section 3.3.2). As the investigators had to read the full-
text of the published studies to determine its quality, the data extraction process was under-
taken simultaneously, as the information would be still fresh in the investigators’ minds.
However, for the studies from grey literature, quality assessment and data extraction processes
were totally separated as reading the full-text was not necessary to estimate the quality of the
primary study.

3.5 Data Synthesis

In software engineering, data synthesis concerns with summarizing the results of the primary
studies in order to help practitioners to adopt the appropriate technology (Biolchini et al.
2005). Two types of synthesis have been espoused by scholars in the field of Software
Engineering, 1) Descriptive (qualitative) Synthesis, and 2) Quantitative Synthesis. Several
methods for the synthesis are explained by Dixon-Woods et al. (2005), these methods are
categorized into three main categories:

Table 5 Pretest Interrater Reliability

Pretest

Pretest 1–1
Pretest 1–2
Pretest 2

Number of Studies Included

Interrater Reliability

10

10

15

0.60

0.80

0.85

Empir Software Eng

1. Theory-led approaches, which are intended to find relationships between findings from
different studies;
2. Analytical approaches, which are intended to analyze the textual data reported by different
studies; and
3. Triangulation approaches, which aim to draw more evidence by comparing qualitative and
quantitative data from different studies.

For the purpose of this research and the type of data presented in the primary studies, the
descriptive synthesis using the analytical approaches is considered the most appropriate type
for the data synthesis. Analytical approaches include but not limited to, grounded theory,
meta-ethnography, Bayesian’s meta-analysis, Miles and Huberman’s data-analysis, and con-
tent survey. Given the research questions of this study, the latter method is determined to be the
most appropriate method to synthesis the data to answer the research questions.

3.5.1 Case Survey Approach

We employed the extended version of the case survey proposed by Jensen and Rodgers (2002)
for categorizing and coding related data from qualitative studies for quantitative analysis. The
data is summarized in a cross-case summary table, in which each row represents a primary
study, and each column represents a specific element related to the Kanban approach, the cell
entry is a color-code indicating that whether a particular study supported the given variable.
The case survey method is a very powerful method to synthesis both qualitative and quanti-
tative evidence (Dixon-Woods et al. 2005).

3.5.2 Coding Mechanism

The coding scheme for categorizing the components of Kanban was determined by
using reciprocal
translation suggested by Kitchenham and Charters (2007), specifi-
cally the Meta-ethnography (Dixon-Woods et al. 2005). The investigators examined
the recurring themes in the articles identified as primary studies in the current
the preliminarily coding scheme. Each category was well defined
literature to draft
and communicated to the research panel (peer-reviewers familiar with the research
area) that provided feedback, and then the coding scheme was revised (see Appendix
4 for description of the coding scheme).

Likewise the inclusion criteria, the coding scheme was pretested twice, following
the first pretest, the coding scheme was revised and the second pretest was conducted
on the same studies to validate the coding scheme clarity and applicability. The co-
author applied the crosschecking technique and coded fifteen of the primary studies
independently using the coding scheme. The interrator reliability of the coding is
shown below in Table 6.

Table 6 Coding Interrater Reliability

Pretest

Pretest 1

Pretest 2

Cross-Check

Number of Studies Included

Interrater Reliability

10

10

15

0.73

0.86

0.92

Empir Software Eng

4 Results

This section is a presentation of the results of the systematic literature review derived
from 37 papers that were finally selected as per the research questions specified
this section
earlier. In addition to the findings related to the Kanban approach,
provides an insight
into the results of the search process as well as the quality
assessment of the primary studies.

4.1 Results of Search and Quality Assessment

The search generated 7,809 articles that were written between 1990 and 2012. Of those, 4,568
articles were identified as duplications through the use of the citation and bibliography
management software package, Mendeley, which reduced the final number to 3,242 articles
for screening.

After applying the inclusion criteria, 3,117 articles were found to be irrelevant or written in
languages other than English, which limited the number of candidate articles to 126 articles.
Finally, 72 candidate studies were excluded because there was a more recent or complete copy,
the full text of the article was not available, or the focus of the article was not on software or
Kanban. As a result, a total of 54 articles were left for full-text reading, quality assessment, and
data extraction.

After analysing, estimating, and assessing the quality of the candidate studies, 17 were
excluded for either being irrelevant or not meeting the minimum quality threshold (see
Appendix 3 for the list of excluded studies). Hence, the primary study list has 37 studies
(S1–S37; see Appendix 1 or the list of included studies). The distribution of the primary
studies per study type (i.e., Journal, Conference, Web Article, Thesis, or Book) is illustrated in
Fig. 2.

Distribution of primary studies per study type

13

7

5

4

8

Journal

Web Article

Thesis

Conference

Book

Fig. 2 Distribution of primary studies per study type

Empir Software Eng

4.2 Research Results

Given the variety of primary study types and research contexts, the primary studies have been
divided into four main categories based upon similarities of the study type and context. Table 7
shows the four categories; this categorization has helped in justifying the scholars’ position
towards each element of the Kanban approach within each category. For example, Type A
scholars see planning as a source of waste as it does not add value from the customer’s point of
view; Type B scholars, however, advocate the use of retrospective planning to facilitate the
achievement of continuous flow.

Figure 3 below shows the distribution of primary studies per category per type. The
distribution revealed some important conclusions based upon the type of the study conducted.
For example, theses in general seek to prove specific phenomena. In this particular study,
theses seek to prove that Kanban extends beyond agility as a stand-alone methodology, which
indicates that Kanban is not yet a well-defined methodology. On the other hand, as shown in
Fig. 3, conferences tend towards Type C, which means that agile practitioners and scholars are
looking into enhancing the existing agile methodologies by implementing the Kanban
approach.

Distribution of the primary studies per category per year is illustrated in Table 8. It shows
that the Kanban approach is relatively new in IT and still needs considerable study and
investigation. The focus on tailoring the Kanban approach to software development was
started in 2003, however, it has increased since 2009 with no clear direction regarding the
elements of the Kanban approach as it offers a less prescriptive element as compared to agile.

4.2.1 Kanban Elements

The analysis of the 37 studies (S1–S37) provided 20 different concepts, principles, and
techniques related to Kanban that have been identified as the Kanban elements. This wide
set of elements resulted from the different perspectives based upon the categories explained
above. In Figs. 4, 5, 6 and 7, the headers (C1–C20) represent the 20 elements of the Kanban
approach, which are described below.

A three-color scale was used to visually represent the 20 elements. The green colour
represents concepts that were discussed and thoroughly described; as such, we refer to them
as “Discussed”. The amber represents those concepts that were merely mentioned; for

Table 7 Categories of Applying Kanban to Software Organizations

Type

Category Name

Category Description

A

B

C

D

Kanban as an element of lean

(beyond agile)

Kanban as an agile
methodology

Hybrid of Kanban and Scrum

Explanatory Kanban

This category considers Kanban one of the primary elements
of lean. Kanban here is used as a starting point or a first
step towards transforming the organization form agile to lean.

This category considers Kanban as an agile methodology.
Kanban is used here to realize the agile manifesto.

This category is considered a combination of both Kanban
and Scrum. Kanban has been used to overcome the
limitations and leverage the advantages of Scrum.

This category explains Kanban and its related concepts and
elements as a stand-alone tool without direct linkage to
either agile or lean.

Empir Software Eng

s
n
o
i
t
a
c
i
l
p
u
p
f
o

.
o
N

16

14

12

10

8

6

4

2

0

Book

Conference

Thesis

Web

Journal

A

B

C

D

Categories of Kanban in Literature

Fig. 3 Distribution of primary studies per category per type

consistency, we refer to them as “Stated.” The red represents the concepts that were not
discussed at all; therefore, we refer to them as “Not Mentioned.”

From Figs. 4, 5, 6 and 7, it is evident that some Kanban elements were established and
discussed more thoroughly than other elements regardless of the study context and type.
Scholars in a specific category discussed some elements that were not mentioned at all or were
touched lightly by scholars in other categories. A summary of the 20 elements is outlined
below:

C1 Kanban method, describes the methodology to implement Kanban in an organization.
Kanban should be implemented in an incremental and evolutionary fashion, the method should
also be reviewed and continuously improved [S2, S4–S8, S11, S12, S19, S21, S29, S31, S33],
which is referred to as “Kaizen” by lean practitioners.

Table 8 Distribution of the primary studies per category per year

Year

2003

2007

2008

2009

2010

2011

2012

Type A

[S5]

[S6] [S31]

[S14][S18][S25]

[S7][S21][S24]
[S26][S43]

[S22][S27][S29]

Type B

Type C

Type D

[S2]

[S28]

[S11]

[S15]

[S3] [S9] [S32]

[S4] [S17] [S32]

[S23]

[S36]

[S35]

[S19]

[S30]

[S10] [S8]
[S12] [S36]

[S1] [S13]
[S16] [S20]

Empir Software Eng

Fig. 4 Cross-Case summary of the Kanban elements for Type A

C2 Kanban board, the tool to visualize the workflow. It represents the activities to be
performed from product/service conceptualization until it reaches the customer’s hand. Some
scholars recommended a design board based upon the existing activities before improving the
process evolutionarily [S2, S5, S7], whilst other scholars [S3, S6, S22, S29] used the
traditional waterfall approach as the basis for the board design. Still other scholars [S12,
S21, 34] used a simpler form of board design to include three main queues (i.e., To Do, In
Progress, and Done).
C3 Pull system, the approach of starting the development process based upon a request from a
customer [S5, S6]. It also requires work-in-progress (WIP) limit to be set out, as a work item
should be pulled only if the WIP limit is not reached [S2, 29]. In addition, it is recommended to
pull the highest priority items, if possible [S24].
C4 Prioritized queue, which refers to the list of ordered requirements or work items. Several
priority criteria were set by different scholars, [S29] suggested that organizations prioritize
work items based upon their value, urgency, and importance. [S2] set priority based upon cost
of delay or resources availability. [S26, S4] defined several queues for each process in the flow
by placing a queue for each process in the Kanban board.
C5 Inclusion criteria, one of the major elements of the Kanban approach. These criteria
guarantee that the work will be of value for the customer before being added to the board.
None of the studies has attempted to define the inclusion criteria, except [S4] which shed some
light on how they prioritize the work items and what were the criteria to add the work items to
the waiting queue.
C6 Work-in-progress (WIP), the concurrent number of work items that is allowed for each
process in the workflow. WIP has been identified as a major characteristic of the Kanban
approach and the main objective of Kanban (Wang et al. 2012). The concept, however, has not
been clearly defined. For instance, majority of the studies suggested that organizations set WIP

Fig. 5 Cross-Case summary of the Kanban elements for Type B

Empir Software Eng

Fig. 6 Cross-Case summary of the Kanban elements for Type C

limit by experiment [S1–S5, S7, S9, S10, S12–S14, S16, S18–S24, S26, S27, S29–S34, S37],
while some studies [S11, S25, S36] did not mention WIP at all.
C7 Done Item, refers to when a work item is considered completed. This element should have
been investigated more systematically as it is considered one of the major contributors to the
continuous flow. Ironically, the majority of the existing primary studies [S1, S4–S7, S11, S13,
S14, S16, S19, S22, S24–S26, S28–S33, S35–S37] did not mention this concept. [S9, S12,
S27] claim that they have established a done item; however, none of the studies offered further
explanation of what that definition was or how it was established. In [S17], the done item was
established as checklists based upon code quality guidelines and standards.
C8 Reverse item, which is a work item that is being moved backward on the Kanban board
instead of moving forward, for instance, a bug fixing work item, which needs further
development. This element has not been considered a major issue as the scholars who shed
some light on this element suggested that the work item flows in loops [S5, S35]; Lundgren (as
cited in [S3]) suggested putting the item back to the backlog. Hence, there is no such backward
movement.
C9 Validated learning, which is a validation process for a feature that has been completed to
measure its value from a business perspective (Ries 2011). The scholars in [S26] suggested
that monitoring and learning is one of the key performance indicators to measure the project
success.
C10 Cycle time/Lead time. This element is arguably the determinant for the process efficiency
and effectiveness as it is used in measuring the performance of Kanban. Nevertheless, Scholars
have not reached an agreement on its definition [S30]. Scholars used cycle time and lead time
interchangeably [S14]. Some scholars [S5, S19, S20, S30] defined cycle time as the time
elapsed from work start to end to produce a feature; however, some other scholars defined it as
the time between deliveries of items [S23, S35].
C11 Performance measurement tool. This element describes how the performance of Kanban
is measured. Some studies [S2, S5, S14] indicated the use of a cumulative flow diagram based

Fig. 7 Cross-Case summary of the Kanban elements for Type D

Empir Software Eng

upon cycle time and WIP. Other studies [S21, S25, S29] encouraged tracking the progress on a
daily basis using burn-down charts.
C12 Bottleneck, a point of congestion where a processing point cannot keep pulling work
items at the same pace of production from the preceding processing point. Bottlenecks can be
identified by visualizing the workflow [S14, S21] or by establishing a measure to detect
bottlenecks [S24] that was adopted from the theory of constraints. Zhang in [S18] suggested
decomposing the bottlenecks into smaller chunks and realizing their expected value in
increments.
C13 Slack or Buffer. The buffer is needed to determine the waiting time [S14] a work item
stays in the queue before being processed, to handle a process’s cycle-time variation [S29,
S31], and to reduce the creation of bottlenecks. An appropriate buffer size should be intro-
duced in front of the bottleneck process; the buffer size should be reviewed periodically and
adjusted as needed [S29].
C14 Waste identification. In summary, waste is anything that does not contribute to the value
creation for the customer; hence, it should be removed (Al-Baik and Miller 2014). Consensus
has been reached on this element; several scholars [S2, S14, S19, S23, S24] agreed that
Kanban helped in visual communication and identification of wasteful activities, so that
wasted energy and productivity were reduced and more energy was put towards a quick
response to customer requests.
C15 Team collaboration. Many software development teams lack collaboration, cohesion, and
cohesiveness. IT teams are still perceived to operate as islands, and bridges between technical
people and business people are needed [S29]. Oostvogesl in [S16] argued that the minute a
team is involved in a Kanban flow, their cooperation mode begins to change. Kanban increases
communications between team members themselves on one side, and team members and
senior management on the other side.
C16 Meeting structure. This element is one of the most arguable elements. On one hand, some
scholars [S30] identified meetings as sources of waste that should be eliminated. On the other
hand, other scholars [S2, S14, S24, S27, S31] recommended a daily stand-up meeting for
15 min to discuss constraints, while Kniberg in [S21] argued that each team should be given
the freedom to decide meeting length and structure.
C17 Avatars, the visual representation of the task owner who is responsible for getting the
work done. This visual demonstration makes Kanban a powerful tool in making informed
decisions. The data presentation on the Kanban board makes it easier to make a factual-based
decision [S14, S29]. Management can get information on resource capacity and availability
that helps in resource assignment and scheduling by just looking at the Kanban board.
C18 Planning and estimation. This element is similar to C16, as there is a contradiction of
views about its importance. Several scholars have identified planning as a source of waste, and
have suggested that reducing this waste will increase both, productivity and customer satis-
faction. For instance, the authors of [S30] claimed that by reducing the planning activities in
their sprint-planning, the lead-time was reduced significantly. Zhang in [S18] reported that
planning took two-thirds of the production process lead-time. However, Zhang in [S18] as
well justified that planning and retrospective activities are important, as they provide an
opportunity for improvement through continuous feedback from team members.
C19 Policies, which govern the Kanban approach, they are the dominant guidelines that
outline what work should be done and how it should be done. Anderson [S5] claimed that
policies help in producing a healthier environment to solve disputes and reach consensus. He
also claimed that policies help in moving a discussion of problems from an emotional and
subjective discussion to a rational and objective discussion. Boeg in [S29] suggested having
the team members involved in developing the Kanban policies.

Empir Software Eng

C20 Feedback loop. Getting feedback from customers is the primary goal from delivering a
product through short cycles and frequent builds. Several scholars [S22, S26, S35] underlined
the importance of a feedback loop in providing facts rather than guessing about how the
customers perceive the product; however, no sufficient effort was put towards defining how
Kanban would help in getting customers involved to provide their feedback.

4.2.2 Benefits and Challenges of Using the Kanban Approach

The primary studies reported various benefits and challenges associated with the use of the
Kanban approach, and the investigators have summarized the benefits and challenges that were
reported by at least five primary studies. Most of the studies reported benefits and challenges
related to the management of the software development process as well as the software
development process itself. Few studies covered the human aspect of the software develop-
ment process. Other areas of software development reported by fewer than five studies
included the configuration management, design, and maintenance.

Table 9 summarizes the benefits of using the Kanban approach to software product
development. The most frequently reported benefits, which were reported by about 46 percent
of the primary studies, were both, enhancing visual control to facilitate the management

Table 9 Benefits of the Kanban Approach

Benefits

Reporting Studies

Percentage of
Reported
Benefit

Enhancing visual control that facilitated and supported the

[S2][S4][S10][S11][S13][S14]

45.9 %

decision-making process

Facilitating the coordination of cross-functional teamwork

and imposing self-organization

Empirically introducing quality circles and kaizen events

Reducing the cycle time/lead time

[S15][S20][S21][S23][S24][S26]

[S29] [S31][S35][S36][S37]

[S1][S2][S4][S5][S10][S14][S15]
[S16][S17][S19][S21][S22][S33]
[S34]

[S2][S5][S11][S14][S17][S19]
[S24][S25][S29][S34][S35]

[S2][S4][S15][S17][S18][S22]
[S24][S25][S29][S32][S37]

37.8 %

29.7 %

29.7 %

Increasing customer satisfaction and realizing high value [S1][S11][S14][S15][S23][S24]

27.0 %

[S25][S26][S29][S35]

Decreasing market and technical risks of the product

[S2][S11][S16][S18][S24][S26]

24.3 %

[S30][S34][S35]

Developing continuous improvements strategies

[S1][S5][S7][S12][S13][S14]

45.9 %

Increasing the predictability in the delivery of the final
products with the constraint of changing customer
requirements

[S15][S17][S19][21][S22][S23]

[S24][S27][S29][S33][S37]
[S2][S4][S11][S14][S15][S23]

[S24][S26][S27][S30][S32][S33]
[S35]

Ensuring skills development and cohesiveness for teams

[S4][S5][S11][S15][S21][S33]

Driving and facilitating organizational change

management and culture changes

[S2][S4][S5][S8][S13][S14][S19]
[S20][S21][S26][S33][S34]

35.1 %

16.2 %

32.4 %

Enhancing quality of product, indicated by decreasing

[S11][S14][S24][S25][S30][S34]

16.2 %

the defects rate, increasing the quality assurance pass
rate, and reducing the number of bugs.

Empir Software Eng

decisions and developing strategies for continuous improvements. While the least-reported
benefit, with 16.2 percent, was related to the team development and cohesiveness.

According to the available literature, Kanban implementation and use can greatly improve
the development process; however, many teams are faced with challenges when using the
approach. There issues are related to the team working together to successfully deliver a
software product. The team should also understand the Kanban board and its different
elements to ensure that they use them effectively to improve their software development
process.

Table 10 emphasizes the challenges that accompanied the decision to use the Kanban
approach. Of the primary studies, 51.4 percent perceived a challenge with the absence of
guidelines for using the Kanban approach within IT settings. Only 13.5 percent reported the
use of the Kanban approach in combination with agile techniques as one of the main
challenges.

The conspicuous challenge reported by the studies is related to a lack of details and the
absence of the guidelines on how the Kanban approach can be used in IT organizations, as well
as the lack of guiding principles on how to introduce the different Kanban elements. The
Kanban approach fundamentally depends on the lean principles that have been developed over
the past 60 years; yet the available literature provides no pure definitions for these principles
(Shah and Ward 2007; Al-Baik and Miller 2014).

4.2.3 Clarity of Available Guiding Principles

As stated previously, in an attempt to establish guidelines for the Kanban approach, Anderson
has differentiated the Kanban method from kanban—the pull system—by capitalizing the
word Kanban. Anderson distinguished between the Kanban method and the kanban pull
system as follows:

Table 10 Challenges with the Kanban Approach

Challenges

Reporting Studies

Percentage of
Reported
Challenge

Defining the measurement metric, for instance, lead time

has been deemed problematic to assess the
performance, is difficult.

Implementing the Kanban approach requires deeper
understanding of lean concepts, principles, and
practices.

[S2][S5][S6][S16][S19][S24]
[S29][S30][S35][S36]

27.0 %

[S3][S7][S10][S18][S22][S23]
[S25][S28]

21.6 %

Unclear definitions of the Kanban prime elements are

used, such as the definition of “Done.”

[S7][S8][S10][S12][S15][S17]

27.0 %

[S18][S23][S32][S37]

Guidelines to implement the Kanban approach and
guiding principles on introducing the Kanban
elements, such as WIP limits, are absent.

[S3][S4][S5][S6][S7][S8][S11]
[S12][S13][S15][16][S17][S18]
[S23][S25][S27][S29][S32][S35]

IT organizations have difficulties in digesting some
elements of the Kanban approach, such as flow.

[S3][S7][S8][S10][S12][S14]
[S16][S24][S25][S35]

51.4 %

27.0 %

Development teams need to be reorganized and

[S3][S4][S7][S10][S27][S33]

16.2 %

restructured.

Priming the Kanban approach to software development

[S6][S9][S10][S12] [S18]

13.5 %

process and integrating it with existing agile techniques
is complicated, expensive, and time-consuming.

Empir Software Eng

Kanban (capital K) as the evolutionary change method that utilizes a kanban (small k)
pull system, visualization, and other tools to catalyze the introduction of the Lean ideas
into technology development and IT operations. [S5, p. 6]

Anderson clearly stated that Kanban is neither a software development life cycle nor a
project management methodology; instead, Kanban is used to incrementally improve an
existing process. Kanban suggests customizing the process template to suit the organization’s
needs; it does not recommend adopting a defined method or template. Due to this distinction,
Kanban has become a controversial in the agile software community (Anderson 2010).

The analysis of the primary studies evealed the reasons behind the dilemma that practi-
tioners and scholars have been experiencing with the established guiding principles in the
domain. Although several studies have conformed to Anderson’s definitions of small
“k” kanban and capital “K” Kanban as reported in [S6] and [S18] in which they distinguished
between Kanban as a change method and kanban as a pull system, Kanban was defined as a
learning tool to incrementally introduce lean principles (pull, flow, and value). [S4] reported
the use of Kanban to modify Scrum by eliminating the iterative development and burn down
chart and introducing several prioritization queues.

Several studies ([S1][S7][S8][S14][S22][S24]) have theoretically defined kanban (small k)
as the pull system to realize the continuous production flow; however, [S1][S8][S22], in fact,
have reported the practices of using Kanban (capital K) as a change method. [S8], for example,
introduced Kanban to amend Scrum by eliminating sprint planning and time boxing, which are
more related to the definition of the Kanban method not the pull system.

Another example was derived from [S1], where in the background section of the study,
kanban (small k) was defined as a pull system that signals an upstream process to start
production when a downstream process is ready to accept more work. Conversely, the reported
findings were more related to the Kanban method (capital K). The authors of [S1] deemed the
changes imposed by Kanban on the Scrum practices as an explicit rejection of Scrum. They
also considered Kanban as a stand-alone lean methodology, which contradicts Anderson’s
statement that Kanban is not a software development life cycle.

Due to the nature of the work in HR, feasibility of implementing Scrum was rejected,
including the concepts of time boxing, scheduled releases, story point estimation, sprint
burn down, etc. Instead, kanban was seen a better fit for the HR department. [S1, p. 1292]

Several studies ([S3][S9][S12][15][S17][S18][S26][S27]) have agreed on three prescription
rules for Kanban: 1) visualize the workflow, 2) limit WIP, and 3) measure the flow. In addition
to these prescribed rules, [S21] and [S29] have added two guiding principles as predecessors
for the prescriptions: 1) start by doing exactly what you are doing right now, and 2) map the
value stream. This tends more towards the Kanban (capital K) method. However, [S3] and [S9]
have described Kanban as an agile methodology and not as a method for change and
improvement, which contradicts Anderson’s description of the Kanban method.

In [S9], the authors reported what they claimed was a transition from Scrum to Kanban,
“Process transition was made overnight, however, the Process Transition stage lasted for two
weeks” [p. 160]. They claimed that the goal was to improve the software development process,
but they reported a big bang transition from Scrum to Kanban, which violates the
Anderson's Kanban rule of incremental change.

The authors in [S30] also reported a transition from Scrum to Kanban, “in 2010, the
company switched from Scrum to Kanban” [S30, p. 48]. They reported amending some
changes to Scrum by introducing Kanban: “Reduced sprint-planning activities (and aban-
doned cross-functional teams) by the end of 2009. Two employees mentioned this relaxation of

Empir Software Eng

the Scrum rules as an explanation for why the lead time reduced from 2009 to 2010” [S30, p.
52]. However, they insisted on calling it a transition, “after replacing Scrum with Kanban, SI
almost halved its lead time, reduced the number of weighted bugs by 10%, and improved
productivity” [S30, p. 52].

The use of small “k” and capital “K” in the manuscript of the primary studies is another
point worth mentioning. In addition to Anderson, only two studies ([S16] and [S34]) distin-
guished between the Kanban method and the kanban pull system. Two other studies ([S15] and
[S37]) interchangeably used small “k” and capital “K.” Surprisingly, [S15] was forwarded by
Anderson himself.

More than 40 percent of the primary studies ([S3][S4][S8][S9][S12][S14][S17][S22][S24]
[S27][S28][S30] [S32][S33][S35]) did not use small “k” in their manuscripts at all. Other
studies ([S6][S23][S25][S31]) followed the formal English writing by using capital “K” at the
beginning of a new sentence and small “k” in the text. The authors of [S26] used small “k” and
capital “K” in their own specific way: the former referred to kanban in manufacturing while the
latter referred to Kanban and its elements in software development.

4.2.4 Kanban Board

The Kanban board, a tool in the Kanban approach, is used to visualize and coordinate the work
of the software development teams. The tool features columns that illustrate a flow of activities
and sticky notes to represent work items. For every activity in the process, limits are placed on
the number of work items that will obtain an overall limited WIP (Ladas 2008).

The Kanban board can be used to enhance communication and flow of information within
an organization. Employees can pin their feedback to the board while management can be able
to respond and make changes within the organization (Pink 2009). In [S29], Boeg argued that
the Kanban board is also used to illustrate issues, challenges, and bottlenecks. However, how
the Kanban board can be used to help teams identifying these challenges and bottlenecks is
poor illustrated.

The analysis of the primary studies showed that the Kanban board is not different from a
Scrum board, also called a Scrum task board. At times, the primary studies explicitly stated this
finding. For example, in [S15], Kniberg and Skarin imposed the question, “What’s the
difference between a Scrum board and a Kanban board?” [S15, p. 15]. They then answered
the question with, “the little 2 in the middle column on the kanban board. That’s all.” The
number refers to the WIP limit.

A similar answer was provided by [S3]:

In Scrum, tasks are placed on boards for time-boxed sprints. Kanban is a different way
to approach this. Instead of being time-boxed, tasks are pulled at any time, only limited
by a work-in-progress (WIP) limit that restricts the allowed number of tasks in every
workflow state. [p. 15]

The authors of [S12] reported that the Kanban board emerged from the changes that they
had made to the Scrum board; however, the authors did not state the nature of these changes.
Poppendieck and Cusumano in [S22] suggested:

“Kanban board might start out in a software development environment, but can easily
expand to include more steps in the value stream, such as marketing and operations.” [p. 31]

However, this has not progressed beyond being a suggestion. Explaining what the Kanban
involves is not enough; more research and analysis must be

it

board is and what
carried out.

Empir Software Eng

Although there are no specific rules regarding how a Kanban board should look,
although there is a proposed Kanban board layout. The Kanban board has columns
that show the activities as they are organized. The columns will then hold different
activities and illustrations. It is necessary to clearly illustrate how the different Kanban
board components work alongside each other and to describe the role of the team
members in ensuring that this is occurs.

4.2.5 Interrelation between Kanban Elements and Lean Pillars

None of the scholars discussed the interrelations between the Kanban elements and
either the lean pillars or the agile manifesto. As such, there is a gap in information on
how the concepts interrelate as the Kanban approach is implemented in an organiza-
the concepts are discussed together to give
tion. In an attempt to reduce this gap,
practitioners a better understanding of the relationships between the lean five pillars
and the elements of the Kanban approach.

The associations were identified based upon the results of the Thematic Analysis
that was espoused to specify the coding scheme. Two types of associations were
identified; positive association and negative association, the latter was determined if at
least one study reported a negative impact or disadvantage resulted from the imple-
mentation of
that specific element of Kanaban. Figure 8 below depicts these
relationships.

Based upon the findings that were reported by the included primary studies, the
figure above shows that four out of five lean pillars (i.e., Value, Values Stream, Flow,
and Pull) may be impacted negatively by implementing any of the following elements:
C8, C13, C16, or C18. Care must be taken when recognizing the necessity of
implementing these elements.

Fig. 8 Associations of Kanban concepts and Lean five pillars

Empir Software Eng

5 Discussion

Kanban is heavily influenced by Anderson (2003) work with lean product development.
Researchers have identified that it is a good fit to be used in the software development just
as it has been used in maintenance and operation (Hibbs, Jewett, and Sullivan 2009). There is a
misconception that Kanban and Scrum are similar with minor differences. In actuality, Kanban
and Scrum are individual concepts as Kanban acts as a change agent and the principles in
Scrum can be used to optimize the Kanban workflow (Poppendieck and Poppendieck 2003).
IT practitioners have started to use Kanban in the software development process as a means
to optimize the workflow, whereby they aim to reduce wastes and to add value to the product
development (Anderson 2010). However, the analysis of the primary studies revealed major
issues in the existing literature that limit practitioners from implementing Kanban appropri-
ately. The issues can be classified into three main taxonomies: 1) definition disagreement,
which includes the elements that lack standard definition in the available literature, 2) vague
guidelines, which consists of the elements that have poor instructions and guidelines on how to
be designed and implemented, and 3) contradiction and conflict, which classifies a element
that contradicts and conflicts with another element or with one of the lean five pillars.

The classification of issues to these taxonomies was not a simple and straightforward task to
accomplish as one issue could be categorized under more than one taxonomy. For instance, C10
(cycle-time/lead-time), the analysis of the available literature has shown that scholars have not
reached an agreement on a standard definition for any of the terminologies, which compromises a
definition disagreement, consequently, there were no agreed upon instructions on how to design
and measure either cycle-time or lead-time, which can be categorized as vague guidelines.

Likewise, contradiction and conflict issue was derived from the definition of cycle-time in [S30]
in which the cycle-time was defined as the time elapsed from work start to end to produce a feature;
the authors argued that cycle-time should not start from the minute a customer asks for a new feature
because of two reasons, the first reason that a feature would have to wait for a while before start
working on that feature, hence, waiting time in the backlog should not be counted towards the cycle-
time; this reason contradicts with waste identification and violates the continuous flow pillar of lean.
The second reason that any person other than the customer might propose a feature to be developed,
which conflicts with pull, a prime element of Kanban and another pillar of lean.

One principal discussion point is the Kanban board design. The analysis of the included studies
showed a theme of designing the board based upon the classical waterfall approach, which was
clearly noted by Lundgren (as cited in [S3]). It is our believe that the recommendations of scholars
in [S2, S5, S7] would be more applicable by representing the current activities and improve
evolutionary, which is very much aligned with lean core pillars, value stream and perfection.

Another interesting argument is related to normalizing the work items in terms of size.
Several scholars [S10, S15, S33] reported the use of cadence and team velocity to determine
the amount of work that could be accomplished during a specific period of time, which implies
the standardization of work items size. Henrik in [S15] clearly reports the decomposition of
work into pieces of roughly the same size based upon the Minimum Marketable Feature
(MMF). On the other hand, Reinertsen in [S35] argues that spending time and efforts to reduce
variances of tasks instead of handling and managing these variances, is actually a wastefulness
activity rather than a value adding activity to the product development lifecycle.

5.1 Proposed Guidelines to the Kanban Approach

Upon reviewing the findings, it was evident that the team members contribute a great deal to
the Kanban implementation in an organization. The Kanban approach has been used by Toyota

Empir Software Eng

in its TPS for many years now through the JIT approach. Consequently, due to its success in
the TPS, many other manufacturing industries use the approach as a means to optimize the
workflow. IT practitioners have started to use Kanban in software development to reduce
waste and to add value to product development (Anderson 2010); however, the approach has
not been fully understood. More than 30 percent of the primary studies identified three core
principles, which are discussed below in greater details.

5.1.1 Visualize the Workflow

The recommendation of this paper is to start implementing the Kanban approach by visualizing the
workflow; It's important to start by understanding how the current system works. One of the bases
of the Kanban approach is the necessary emphasis on the current system because Kanban serves as
a change agent not as a replacement for the whole process. Several studies ([S5][S7][S21][S29])
recommended visualizing the exiting development process and its activities, and then modifying
the board as the process is improved and wastefulness activities are eliminated.

There are different ways to visualize the workflow to improve it; one of the approaches as
recommended by more than 24 percent of the primary studies ([S1][S3][S7][S14][S15][S20]
[S22][S23][S24]) is through value stream mapping. Value stream mapping is the process
through which the team identifies all the steps in the software development process in order
to make a product that is desirable to the client. The term “stream” here refers to the fact that
there is a smooth unbroken flow between varieties of steps. A continuous smooth flow of
valuable new features and elements will lead to a desired final product.

For a value stream to lead to successful software product development, it is crucial for
everyone to be considered, from the customers to the developers and support engineers not
merely the development team (Womack and Jones 2003). To assess the efficiency of the value
stream that composes the development process, the team can employ the element of metrics to
investigate the efficiency of the process and its various activities and tasks (see Section 5.1.3).
The value stream should be carried out at several stages and it should include an element as
quarterly value stream mapping to reassess the entire value stream process (Hibbs et al. 2009).
This is an important consideration because it incorporates adding value to the various
processes of the software development and ensures that the client is presented with a high-
quality product (Poppendieck and Poppendieck 2003). Lean thinking has been argued by
several scholars to be more concerned with doing the right work at the right time rather than
concentrating on who is doing the right work (Bronza 2012).

5.1.2 Limit and Visualize WIP

Following visualizing, the workflow understands and puts limits on the work in progress (WIP).
The WIP refers to the concurrent number of work items allowed in each process. The correct use of
the Kanban board ensures minimal WIP, which highlights the constraints and teamwork coordi-
nation. This enables the team, as well as other stakeholders, to keep track of their development and
distinguish between work items that are in progress and work items that are complete in the board.
This visualization gives the team insight on how the development process is moving along.

Despite the fact that several studies ([S3][S5][S9][S12][15][S17][S18][S21][S26]
[S27][S29]) have explicitly identified limiting WIP as one of the core elements of the Kanban
approach, only 13 percent of the primary studies reported their experiences on how to
set WIP limits. The value of WIP has been outlined in almost 92 percent of the
primary studies; for example, in [S6], Shinkle cited a statement that had been made
by a developer during the Kanban implementation:

Empir Software Eng

WIP limits seem to be the worst understood part of the kanban system. When used
properly, it exposes bottlenecks and reduces lead time for individual work items. Used
improperly, it can starve developers for work or result in too many people working on
the same work items. [S6, p. 188]

In [S16], Oostvogesl suggested that there should be set rules about the WIP limits along the
development process. However, he stated, “There is no exact science on determining WIP
limits” [S16, p. 39]. This fact among others has led more than 75 percent of primary studies to
suggest constraining WIP limits by experiments. In [S5], Anderson established a general rule
to define WIP limits: “the work-in-progress limits should be agreed upon by consensus with up
and down stream stakeholders and senior management” [p. 113]. He argued that consensus
creates commitment to adhering to the WIP limit.

A few studies endeavoured to establish formulas to generalize setting WIP limits based
upon their own experiences. In [S5], for example, Anderson suggested that the WIP limit lies
between 1 and 3 work items per person at any given time. Hence, if the team is composed of
10 members, and the consensus has been reached on having 2 work items per person, then the
WIP limit is agreed to be 20 for the team. Other studies reported WIP as ranges; for example,
in [S8] Terlecka reported the following:

The team reached the conclusion (later empirically checked by other teams) that the
recommended limit of cards is between the number of team members plus 1, to number
of team members times 2 minus 2, so for a 7-person team, it would be between 8 and 12.
[S8, p. 100]
In [S15], Kniberg and Skarin suggested, “The first WIP limit we used was 2n-1 (n=number
of team members, −1 to encourage cooperation)… By monitoring the Kanban board, it is easy
to figure out the right limits along the way” [S15, p. 71]. They also provided three pages of
example on limiting WIP (see [S15] pp. 19–22). Limiting WIP in [S6], [S31], and [S35] was
suggested to be determined using Little’s law, which is one of the principles of queuing theory.
Little’s equation is presented here:

WIP Limit ¼ Average Processing Rate Throughput

ð

Þ
Þ (cid:2) Cycle Time Flow Time

ð

Several primary studies ([S10][S13][S33][S35][S37]) have discussed a combination be-
tween Little’s law and an innovative approach for controlling the flow and determining WIP
limits. Differential service is an approach to differentiate quality of service by work stream.
The approach suggests dividing the work items into categories with different classes of
services. Then, the WIP limits can be set for each category (Reinertsen 2009); in that sense,
the Kanban approach becomes more flexible and responsive to rapidly changing customer
requirements.

The classification of work items helps prioritize the work activities, which leads to effective
management and high- quality products. Work items are prioritized to avoid delays within the
software development process. Because tasks are not equal, they are dealt with differently, which
means that activities and tasks are treated according to their specific characteristics. The type of
work determines the class given to the development process.

As suggested by [S3], the work items can be divided into categories of high, medium, and
low categories. Another categorization was suggested by [S13], where work items were
divided into the following class: “Normal Class of Service,” “Special Class of Service,” and
“Expedite Class of Service.” Table 11 provides an example of how the combined approach of
Little’s law and differential service can be used to specify the WIP limits for each category.

Empir Software Eng

The example considers two developers who each one works 40 h per week; with the given
throughput and the weekly time that is spent on each work item, the total working hours equals
80 h per week. The targeted cycle time per work item represents the time that is required for a
work item to continuously flow throughout the development process without interruption. The
WIP limit for each category of the service class is calculated using Little’s formula by
multiplying the throughput by the cycle time.

5.1.3 Measure the Flow

Measuring metrics is an important element in the Kanban approach. Based on the definition of
the Kanban approach, the continual delivery of value to customers should be emphasized
while promoting continuous learning and improvements. Hence, the primary goal of measur-
ing flow is to pinpoint the improvement opportunities that will lead to a smoother flow to
quickly deliver value to customers.

In measuring flow, it is important to remember that the system's capacity should not be
exceeded. If the system is overloaded, the quality of the development will be low. WIP limits
can be utilised to overcome the capacity overloading problems. The lower the WIP limits, the
shorter the cycle time, presuming the throughput is constant, as there is a linear relationship
between WIP and cycle time as shown in Little’s law.

In [S5], Anderson expressed the relationships among WIP, lead time, and defects. He
claimed that based upon industrial evidences, “there is a correlation between increased lead
time and poorer quality. Longer lead times seem to be associated with significantly poorer
quality… Longer average lead times result from greater amounts of work-in-progress” [p. 27].
Hence, measuring flow depends mainly on measuring the amount of WIP, lead time, and
defect rates to guage the quality of the product under development.

After identifying what should be measured and why it should be measured, the instruments
to measure the flow can be narrowed down to the following tools: cumulative flow diagrams,
lead time/cycle time, and defect rate. This is in line with what has been reported by about
30 percent of the primary studies ([S2][S3][S13][S15][S20][S24][S26][S27][S29][S33][S35]).
Figure 9 provides an example of how the cumulative flow diagram is depicted and interpreted.
The figure shows three types of queues 1) Total, which represents the amount of work
waiting in the queue to be pulled for development, 2) WIP, which represents the amount of work
that is currently under development, and 3) completed, which represented the amount of work
that was completed. The horizontal axis – X provides a good projection of the time required to
complete the work item at hand, while, the vertical axis – Y, specifies the number of WIP.

Figure 9 represents a simple cumulative flow diagram followed by a naïve explanation;
measuring the flow is a significant area to investigate and study; in fact, in [S24], Petersen and
Wohlin produced a full research paper on the topic in which they empirically evaluated defined
measures that had been applied to the visualized cumulative diagrams to increase throughput and
reduce lead-time. Furthermore, Reinertsen ([S35]) devoted an entire book to the principles of
product development flow.

Table 11 Example of Specifying
WIP Using Little’s Law and Dif-
ferential Service

Category Throughput

per Week

Weekly Time
per Work Item

Targeted Cycle Time
per Work Item

WIP
Limit

Expedite 3
5
Special

Normal

11

2.5
3.5

5

1
2

3

3
10

33

Empir Software Eng

Fig. 9 Cumulative Flow Diagram

5.2 Validity Threats

An overall challenge experienced when undertaking this research study was the definition of the
scope, as the area under study is multidisciplinary and covers a wide range of fields. Searches
covering all the involved disciplines would be difficult and complex, as terminology may refer
to a different notion in each field; this comprises a threat to construct validity. This threat was
considered during the definition of the search criteria and has led to the avoidance of a high risk
of errors. However, we could not discount the impact of confounding and local variables in
having significant impact on the search results, which is considered a threat to internal validity.
Another limitation of this study forms a threat to content validity, as we had no control over
the quality and level of details presented in the primary studies. Since most papers lacked
adequate information for classifying them, it would have been preferred to have parallel data
extraction and to crosscheck the information on all the study papers. Nevertheless, a lack of
resources made this impossible.

Another threat is selection bias that compromises a reliability threat. To protect the study
against this threat, the research took three strategies. Firstly, to balance precision and compre-
hensiveness of the search string, the trial searches were performed using Google Scholar where
several alternative keywords were used and keywords were also combined. Secondly, the
publications were selected from different sources such as the Scopus, Scirus, and InfoQ among
others. Thirdly, measures were taken to avoid and limit built-in bias on the selection that was
based on title, keywords, and abstract. It is possible that we may have missed relevant papers
that would have provided great insight to the implementation of the lean-Kanban approach.
This possible omission comprises a threat to external validity.

Empir Software Eng

6 Conclusions

This systematic review incorporated 37 primary studies in which the context ranged from large
to complex projects in various companies and also individual projects. The majority of the
studies reported the implementation of lean practices in general, rather than focusing on the
Kanban approach. The studies, however, reported the Kanban approach as the most frequently
used lean practice. Further, a number of recently published studies (from 2006 onwards)
illustrated a specific use of the Kanban approach, which is very much in line with the Wang
et al. (2012) study. They noted the trend to use more specific lean practices, in particular the
Kanban software development approach.

The Kanban approach to software development is a more direct implementation of lean
product development. In software development, lean does not only refer to the lean
manufacturing, but also refers to the lean elements translation to the software development
application. Kanban offers a less prescriptive element as compared to agile methods and has
become a popular extension to traditional agile methods (i.e. Scrum and XP) (Hibbs, Jewett,
and Sullivan 2009).

The lean methodology, via the Kanban approach, can be argued to be the fastest
growing product development approach in the past decade. However, despite the interest
in the approach, there is neither a standard definition of the Kanban approach nor a clear
definition of its elements for software development as indicated by 27 percent of the
primary studies. This lack of definition causes a series of challenges to individuals who
want to implement the Kanban approach, which has led to the need to address its
elements.

The use of the Kanban approach comes with several challenges, as reported by more than
50 percent of the primary studies, the conspicuous challenge is related to a lack of details and
absence of the guidelines on how the Kanban approach can be used in IT organizations, as well
as the lack of the guiding principles on how the different Kanban elements can be introduced.
In an attempt to address these challenge, this study provided an analysis of the included 37
studies to investigate the reported Kanban approach's elements, uses, and presentations.

As derived from the available literature, more than 32 percent of the primary studies agreed
on that the Kanban approach has three prime principles 1) Visualize the workflow, 2) Set WIP
limits, and 3) Measure the flow. It is important for the development team to have consensus on
how these three principles should be implemented and used. Some guiding principles have
been synthesized from the primary studies, where they were used and proven successful. Team
cohesiveness and teambuilding are important elements for ensuring a successful Kanban
approach.

Software development teams in the various firms in the IT industry are considered to still
operate as islands and they should instead work together to ensure system quality and
consistency (Pink 2009; Oostvogels 2012). More than 16 percent of the primary studies
reported that the use of the Kanban approach drops the use of the isolated teams and led
teams to work together to ensure high-level quality as well limited use of the available
resources. The team members should participate in making the Kanban board to ensure that
there is a feeling of ownership and pride.

Despite the reported challenges, the Kanban board, as reported by almost 46 percent of the
studies, is an efficient visualization tool and should be used effectively to ensure that the
development process takes place as expected. This is not the only benefit of the Kanban
approach, our findings show that more than 32 percent the primary studies used the Kanban
approach to effectively deriving and leading organizational changes as well as facilitating the
cross-functional teamwork.

Empir Software Eng

The recommendation of this paper is to discuss the Kanban elements together based on the
five pillars of the lean approach to minimize the risk of evolving contradictory elements and to
reduce the gap in the literature by creating a common ground to define these elements. In turn,
this facilitates establishing guidelines and instructions on how to setup the Kanban approach to
give practitioners an overall framework that increases the likelihood of successfully
implementing the Kanban approach in IT organizations.

The paper concludes that there is limited research that gives guidelines to the practitioners of the
software development in implementing the Kanban approach. It is also evident that there is a strong
need for systematic studies on the benefits of the lean-Kanban approach. This includes the analysis
of what needs to be changed or improved within the lean-Kanban practices to their application in the
IT industry. Further research is also needed to provide formulas to help practitioners in defining the
primary elements of Kanban, such as inclusion criteria and defining the “done” items.

The correct use of the Kanban approach ensures that there are realized benefits to IT
organization, including but not limited to, minimal work in progress; give a highlight on the
constraints and a coordination of the teamwork. The lean approach is more than the Kanban
method and it has been proposed that the Kanban approach should use more approaches from the
lean principle so as to take the full advantage of the lean principles in the software development.
The Kanban approach shares principles of the agile methodologies on the basis that the
requirements are explained in atomic features, which are then implemented incrementally.

Appendix 1: List of Included Studies

[S1] Wang, X., Conboy, K., & Cawley, O. (2012). “Leagile” software development: An
experience report analysis of the application of lean approaches in agile software development.
Journal of Systems and Software, 85(6), 1287–1299.

[S2] Anderson, D. J. (2010). Kanban: Successful Evolutionary Change for Your Technology

Business. Blue Hole Press.

[S3] Norrmalm, T. (2011). Achieving Lean Software Development Implementation of
Agile and Lean Practices in a Manufacturing-Oriented Organization. Retrieved from http://
uu.diva-portal.org/smash/record.jsf?pid=diva2:400627

[S4] Polk, R. (2011). Agile & Kanban in coordination. In Proceedings - 2011 Agile

Conference, Agile 2011 (pp. 263–268).

[S5] Anderson, D. J. (2003). Agile management for software engineering: Applying the

theory of constraints for business results. Prentice Hall Professional.

[S6] Shinkle, C. M., & Shihkle, C. M. (2009). Applying the Dreyfus Model of Skill
Acquisition to the Adoption of Kanban Systems at Software Engineering Professionals
(SEP). In Agile Conference, 2009. AGILE’09. (pp. 186–191). IEEE.

[S7] Betz, C. T. (2011). Chapter 1 - IT in a World of Continuous Improvement. Architecture
and Patterns for IT Service Management, Resource Planning, and Governance: Making Shoes
for the Cobbler’s Children, 1–31.

[S8] Terlecka, K. (2012). Combining Kanban and Scrum – Lessons from a Team of

Sysadmins. In Agile Conference (AGILE), 2012 (pp. 99–102).

[S9] Nikitina, N., & Kajko-Mattsson, M. (2011). Developer-driven big-bang process
transition from Scrum to Kanban. In Proceedings - International Conference on Software
Engineering (pp. 159–168).

[S10] Turner, Richard, Ingold, D., Lane, J. A., Madachy, R., & Anderson, D. (2012).
Effectiveness of kanban approaches in systems engineering within rapid response environ-
ments. Procedia Computer Science, 8(0), 309–314.

Empir Software Eng

[S11] Fisher, K. G., & Bankston, A. (2009). From Cradle to Sprint: Creating a Full-Lifecycle
Request Pipeline at Nationwide Insurance. In Agile Conference 2009, AGILE ’09 (pp.
223–228).

[S12] Nikitina, N., Kajko-Mattsson, M., & Stråle, M. (2012). From scrum to scrumban: A
case study of a process transition. In 2012 International Conference on Software and System
Process, ICSSP 2012 - Proceedings (pp. 140–149).

[S13] Turner, Richard, & Lane, J. A. (2013). Goal-question-Kanban: Applying Lean
Concepts to Coordinate Multi-level Systems Engineering in Large Enterprises. Procedia
Computer Science, 16, 512–521.

[S14] Petersen, Kai. (2010). Implementing Lean and Agile Software Development in
Industry. Retrieved from Belkinge Institute of Techology’s Dissertations and Theses Database
(UMI No. 2010:04)

[S15] Kniberg, H., & Skarin, M. (2009). Kanban and Scrum-making the most of both.

InfoQ. Retrieved from http://www.infoq.com/minibooks/kanban-scrum-minibook

[S16] Oostvogels, N. (2012). Kanban for skeptics: Clear answers to Kanban in software

development. Leanpub. Retrieved from https://leanpub.com/kanbanforskeptics

[S17] Seikola, M., Loisa, H., & Jagos, A. (2011). Kanban Implementation in a Telecom
Product Maintenance. In Software Engineering and Advanced Applications (SEAA), 2011 37th
EUROMICRO Conference (pp. 321–329).

[S18] Zhang, Y. (2010). Kanban Re-engineers Production Process In Åkers Sweden AB.
Retrieved from Mälardalen University’s Dissertations and Theses Database. (UMI No. 10064)
[S19] Anderson, D. J., & Garber, R. (2007). A Kanban System for Sustaining Engineering
on Software Systems. Retrieved April, 01, 2013 from http://www.lean.org/FuseTalk/Forum/
Attachments/Kanban%20for%20Software%20Development-Corbis.pdf

[S20] Medinilla, Á. (2012). Lean and Agile in a Nutshell. In Agile Management SE - 2 (pp.

19–52). Berlin, Heidelberg: Springer Berlin Heidelberg.

[S21] Kniberg, H. (2011). Lean from the Trenches: Managing Large-Scale Projects with

Kanban. The Pragmatic Bookshelf. Pragmatic Bookshelf.

[S22] Poppendieck, M., & Cusumano, M. A. (2012). Lean Software Development: A

Tutorial. Software, IEEE, 29(5), 26–32.

[S23] Poppendieck, M., & Poppendieck, T. (2003). Lean Software Development: An Agile

Toolkit. Addison-Wesley.

[S24] Petersen, K, & Wohlin, C. (2011). Measuring the flow in lean software development.

Software-Practice & Experience, 41(9, SI), 975–996.

[S25] Heidenberg, J., & Porres, I. (2010). Metrics Functions for Kanban Guards. In
Engineering of Computer Based Systems (ECBS), 2010 17th IEEE International Conference
and Workshops on (pp. 306–310).

[S26] Ikonen, M., Pirinen, E., Fagerholm, F., Kettunen, P., & Abrahamsson, P. (2011). On
the impact of Kanban on software project work: An empirical case study investigation. In
Proceedings - 2011 16th IEEE International Conference on Engineering of Complex Comput-
er Systems, ICECCS 2011 (pp. 305–314).

[S27] Han, B., & Xie, J. (2012). Practical Experience: Adopt Agile Methodology Com-

bined With Kanban For Virtual Reality Development.

[S28] Kinoshita, F. (2008). Practices of an agile team. InAgile, 2008. AGILE’08.

Conference(pp. 373-377). IEEE.

[S29] Boeg, J. (2012). Priming Kanban: A 10 step guid to optimizing flow in your software

delivery system (Second Edi.). Chronografisk A/S.

[S30] Sjøberg, D. I. K., Johnsen, A., & Solberg, J. (2012). Quantifying the Effect of Using

Kanban versus Scrum. Software, IEEE, 29(5), 47–53.

Empir Software Eng

[S31] Ladas, C. (2009). Scrumban-essays on kanban systems for lean software develop-

ment. Modus Cooperandi Press.

[S32] Cocco, L., Mannaro, K., Concas, G., & Marchesi, M. (2011). Simulating Kanban and
Scrum vs. Waterfall with System Dynamics. In Agile Processes In Software Engineering And
Extreme Programming (Vol. 77, pp. 117–131).

[S33] Greaves, K. (2011). Taming the Customer Support Queue: A Kanban Experience

Report. In Agile Conference (AGILE), 2011 (pp. 154–160).

[S34] Ericsson, R., & Granlöf, A. (2011). The effects of Kanban in software development
teams : a study of the implementation at Sandvik. Retreived from Dalarna University’s
Dessertation and Theses Database (http://du.diva-portal.org/smash/record.jsf?pid=diva2:519094)
[S35] Reinertsen, D. G. (2009). The principles of product development flow: second

generation lean product development. Celeritas Publishing.

[S36] Hiranabe, K. (2007). Visualizing Agile Projects using Kanban Boards. InfoQ.

Retrieved April 01, 2013, from http://www.infoq.com/articles/agile-kanban-boards

[S37] Turner, R, Madachy, R., Ingold, D., & Lane, J. A. (2012). Modeling kanban
processes in systems engineering. In 2012 International Conference on Software and System
Process, ICSSP 2012 - Proceedings (pp. 78–82).

Appendix 2: Quality Instrument

Empir Software Eng

Appendix 3: List of Excluded Studies

Akbar, R., Hassan, M. F., & Abdullah, A. (2011). A Review of Prominent Work on Agile
Processes Software Process Improvement and Process Tailoring Practices. In Software Engi-
neering And Computer Systems, PT 3 (Vol. 181, pp. 571–585).

Antanovich, A., Sheyko, A., & Katumba, B. (2010). Bottlenecks in the Development Life

Cycle of a Feature - A Case Study Conducted at Ericsson AB.

Cockburn, A. (2006). Agile software development: the cooperative game.
Corona, E., & Pani, F. (2012). An investigation of approaches to set up a Kanban board,
and of tools to manage it. In SITE’12 Proceedings of the 11th international conference on
Telecommunications and Informatics, Proceedings of the 11th international conference on
Signal Processing, pp. 53-58.

Hibbs, C., Jewett, S., & Sullivan, M. (2009). The art of lean software development: a

practical and incremental approach.

Hiranabe, K. (2008). Kanban Applied to Software Development: from Agile to Lean. InfoQ.

Retrieved April 01, 2013, from http://www.infoq.com/articles/hiranabe-lean-agile-kanban
Leffingwell, D. (2007). Scaling software agility: best practices for large enterprises.
Pettersen, J.-A., & Segerstedt, A. (2009). Restricted work-in-process: A study of differ-
ences between Kanban and CONWIP. International Journal of Production Economics, 118(1),
199–207.

Sanders, A. (2007). Kanban Ground Rules Example for a Specific Team. Retrieved April
01, 2013, from http://aaron.sanders.name/agile-fashion/kanban-ground-rules-example-for-a-
specific-team

Sanders, A. (2007). Naked Planning Explained – Kanban in the Small. Retrieved April 01,
2013, from http://aaron.sanders.name/agile-fashion/naked-planning-explained-kanban-in-the-
small

Scotland, K. (2009). Kanban, Flow and Cadence. EMC Corporation. Retrieved from http://

availagility.files.wordpress.com/2008/04/kfc-development-accu2009.pdf

Scotland, K. (2011). Crystallising Kanban with Properties, Strategies and Techniques.
Retrieved from http://availagility.co.uk/2011/08/03/crystallising-kanban-with-properties-strat-
egies-and-techniques/

Staats, BR., & Upton, D. (2009). Lean Principles , Learning , and Software Production :

Evidence from Indian Software Services. Harvard Business School

Staats, BR., Brunner, D., & Upton, D. (2011). Lean principles, learning, and knowledge

work: Evidence from a software services provider. Journal of Operations Management.

Takahashi, K. (2003). Comparing reactive Kanban systems. International Journal Of

Production Research, 41(18), 4317–4337.

Vilkki, K. (2010). When Agile Is Not Enough. In Lean Enterprise Software And Systems

(Vol. 65, pp. 44–47).

Weber, B., & Wild, W. (2004). Application of lean and agile principles to workflow
management. In Extreme Programming And Agile Processes In Software Engineering, Pro-
ceedings (Vol. 3092, pp. 258–261).

Appendix 4: Coding scheme

Empir Software Eng

Category

Description

Coding Rule

Kanban

method

Kanban
Board

It refers to the method of incremental and

evolutionary process change for
organizations and institutions.

Any description of the steps that has been
undertaken to implement the Kanban
approach into an organization.

This refers to visual tools in project

Any tool or means used to visualize the

management application that have a basis on
Kanban for the visualization and
optimization of the workflow. It also enables
real time teamwork and team collaboration

processes, tasks, or the workflow of the
software product development.

Pull System This refers to trigger the process of working on
producing only what the customer needs by
the quantity that is needed and only when it
is needed

The approach of starting the development
process based upon a request from the
customer.

Work Item

It refers to a task that needs to be visualized and

Any feature, user stories, MMF or any other

Priority

Queue

Inclusion
Criteria

Work In

Progress
(WIP)

Done Items

Reverse
Items

Validated

Learning

added to the Kanban board.

item that needs to be visualized and has to go
through different phases through the
development process.

It refers to the list of ordered requirements or

Any term indicates the use of queuing,

work items

ordering, or prioritizing tool. i.e. backlog or
to-do items.

It refers to the rules that are used to make the
decision of adding the work item to the
visualization tool. Ideally, it should consider
the value from a customer perspective.

Any norm, rule, or standard that is used to

determine what work-item should be added
to the board, i.e. through the use of MMF or
Story point.

It refers to the concurrent number of work items
that is allowed in each development phase.

Any rule, technique, to determine the number

of concurrent work items.

These are the items that have been completed
on a particular phase and are ready to be
released to the next stage.

The work items that have been through a

specific development process and ready to
be pulled by the next development process.

It refers to items that are being moved

backwards on the Kanban board instead of
moving forward.

Any work item that needs to go back to the
previous development process, i.e. bug
fixing.

This variable refers to the process of learning
what works and what does not work for a
specific organization. Its intent is to measure
the a work item’s value from a business
perspective

Validate learning is whereby an organization
over time obtains a formula for obtaining,
qualifying, and selling to customers in a
particular target area. This can refer to the P-
D-C-A cycle.

Cycle Time

Cycle time is the actual time required to

Lead Time

complete one cycle of an operation for one
work item from start to finish while the work
item flows seamlessly through the
development process.

This is the time of completing one work item
including delays between the initiation of a
process and its execution, i.e. the time
between making an order and the order
being delivered.

Cycle time is a calculated based upon the time
spent on producing a work item from the
beginning until delivery without delays.

Lead-time is calculated from the moment of

requesting the work item until the moment
that item is delivered to the customer.

Empir Software Eng

Category

Description

Coding Rule

Measurement

This usually a diagraming tool illustrates the

Any measurement diagram is used to represent

tool

cycle taken by a work item as it goes through
the system.

the performance of the Kanban.

Bottleneck

Bottlenecks are the constraints that are faced
during the product development process.

Any work item that is slacking and slowing the

process down.

Slack / Buffer This refers to designed quantity of time applied

Any spare time put aside to help in delivering

to task schedule to protect the success
implementation of the required deliverable
on time.

the work item on time.

Kanban

These principles offer a framework that is

These are the guiding concepts of the Kanban

Principles

chosen in the software development process
by using the Kanban approach.

approach.

Kanban

This refers to production control system that is

Any technique used to allow no surplus

techniques

used to overcome the problems once
occurred.

production and gives the workers the right to
stop if they cannot keep up.

Avatar

A visual representation of the work item details. Any visual representation of the details related

to a work item, this includes sticky notes,
symbols or any other means.

References

Al-Baik O, Miller J (2014) Waste identification and elimination in information technology organizations. Empir

Softw Eng 19(6):2019-2061

Anderson DJ (2003) Agile management for software engineering: applying the theory of constraints for business

results. Prentice Hall Professional, Upper Saddle River

Anderson DJ (2010) Kanban: successful evolutionary change for your technology business. Blue Hole Press, Seattle
Banerjee M, Capozzoli M, McSweeney L, Sinha D (1999) Beyond kappa: a review of interrater agreement

measures. Can J Stat 27(1):3–23

Biolchini J, Mian PG, Natali ACC, Travassos GH (2005) Systematic review in software engineering. Systems

Engineering and Computer Science Department COPPE/UFRJ, Technical Report ES, 679(05)

Brereton P, Kitchenham BA, Budgen D, Turner M, Khalil M (2007) Lessons from applying the systematic

literature review process within the software engineering domain. J Syst Softw 80(4):571–583
Bronza G (2012) The Human Side of Kanban-How to helpYour Team Deliver. 3P Vantage Media
Dixon-Woods M, Agarwal S, Jones D, Young B, Sutton A (2005) Synthesising qualitative and quantitative

evidence: a review of possible methods. J Health Serv Res Policy 10(1):45–53B

Dybå T, Dingsøyr T (2008) Empirical studies of agile software development: a systematic review. Inf Softw

Technol 50(9–10):833–859

Hibbs C, Jewett S, Sullivan M (2009) The art of lean software development: a practical and incremental approach
Ivarsson M, Gorschek T (2010) A method for evaluating rigor and industrial relevance of technology evaluations.

Empir Softw Eng 16(3):365–395

Jensen J, Rodgers R (2002) Cumulating the intellectual gold of case study research. Public Adm Rev 61:235–246
Kitchenham BA, Charters S (2007) Guidelines for performing systematic literature reviews in software engi-

neering. EBSE Technical Report (Vol. EBSE-2007-01)

Ladas C (2008) Scrumban-essays on kanban systems for lean software development. Modus Cooperandi Press,

New York

Liker J (2004) The Toyota Way: 14 management principles from the World’s greatest manufacturer. McGraw-

Hill, New York

Liker JK, Hoseus M (2008) Toyota culture: the heart and sould of the Toyota Way. McGraw-Hill, New York,

USA

Empir Software Eng

Magee D (2008) How Toyota became #1. Penguin Group, New York, USA
Ohno T (1988) Toyota production system: beyond large-scale production. Productivity Press, Cambridge
Oostvogels N (2012) Kanban for skeptics: clear answers to kanban in software development. Leanpub,

Vancouver

Petticrew M, Roberts H (2006) Systematic reviews in the social sciences: a practical guide. Blackwell Publishing

Ltd., Oxford

Pink D (2009) The suprising truth about what motivates us. Riverhead books, New Yrok
Poppendieck M, Poppendieck T (2003) Lean software development: an agile toolkit. Addison-Wesley

Professional, Indianapolis

Reinertsen DG (2009) The principles of product development flow: second generation lean product development.

Celeritas Publishing, Buchanan

Ries E (2011) The lean startup: How today’s entrepreneurs use continuous innovation to create radically

successful businesses. Random House Digital Inc, New York

Shah R, Ward PT (2007) Defining and developing measures of lean production. J Oper Manag 25(4):785–805
Wang X, Conboy K, Cawley O (2012) “Leagile” software development: an experience report analysis of the

application of lean approaches in agile software development. J Syst Softw 85(6):1287–1299

Womack JP, Jones DT (2003) Part I: lean principles. In: Lean thinking: banish waste and create wealth in your

corporation. Free Press, NY, pp 15–98

Womack JP, Jones DT, Roos D (1990) The machine that changed the world. Free Press, New York

Osama Al-Baik is currently a doctoral candidate at University of Alberta in Canada, his research interests have
been in Software and Systems Engineering, Lean Software Development, Software Process Improvements (SPI),
and Software Project Management. He has over 10 years of experience and technical expertise in diverse range of
technologies within multiple industry settings. He has demonstrated accumulative success in various footprints
including SDLC implementation, Process Improvements and Reengineering, IT Governance, IT Operations and
implementing international IT quality standards. Osama has been working in software development and project
management for multinational companies, where he has held senior positions. He has a Bachelor’s degree in
Computer Information Systems from Amman University, Jordan and a Master's degree in Software Engineering
from DePaul University, USA. He is a Project Management Professional (PMP) by PMI and a Certified Project
Manager (CPM) by IAPPM.

Empir Software Eng

James Miller is a Professor of Software Engineering at University of Alberta in Canada. He received his BSc
and PhD degrees in Computer Science from the University of Strathclyde, Scotland. Subsequently, he worked at
the United Kingdom’s National Electronic Research Initiative on Pattern Recognition as a Principal Scientist,
before returning to the University of Strathclyde to accept a lectureship, and subsequently a senior lectureship in
Computer Science. He is the principal investigator in a number of research projects that investigate software
verification, validation and evaluation issues across various domains, including embedded, web-based and
ubiquitous environments. He has published over one hundred refereed journal and conference papers, and sits
on the editorial board of the Journal of Empirical Software Engineering.

