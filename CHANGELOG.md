# RE NXT API Change Log (v2)
We periodically update the API in order to deliver new features and to repair defects discovered in previous versions.  In most cases, these changes will be transparent to API developers.  However, occasionally we need to make changes that require developers to modify their existing applications.  

## [Unreleased][unreleased]
### Fixed
- Fix Markdown links to tag comparison URL with footnote-style links.

## Release 2015-10-12 (Oct 12, 2015)
### Added
- All collections now include an empty list for the property when the collection contains no resources. Previously the  property would be omitted from the response. See the API Reference for complete details on queries and responses for API data.

## [0.0.5] - 2014-08-09
### Added
- Markdown links to version tags on release headings
- Unreleased section to gather unreleased changes and encourage note
keeping prior to releases.

## [0.0.4] - 2014-08-09
### Added
- Better explanation of the difference between the file ("CHANGELOG")
and its function "the change log".

### Changed
- Refer to a "change log" instead of a "CHANGELOG" throughout the site
to differentiate between the file and the purpose of the file — the
logging of changes.

### Removed
- Remove empty sections from CHANGELOG, they occupy too much space and
create too much noise in the file. People will have to assume that the
missing sections were intentionally left out because they contained no
notable changes.

## [0.0.3] - 2014-08-09
### Added
- "Why should I care?" section mentioning The Changelog podcast.

## [0.0.2] - 2014-07-10
### Added
- Explanation of the recommended reverse chronological release ordering.

## 0.0.1 - 2014-05-31
### Added
- This CHANGELOG file to hopefully serve as an evolving example of a standardized open source project CHANGELOG.
- CNAME file to enable GitHub Pages custom domain
- README now contains answers to common questions about CHANGELOGs
- Good examples and basic guidelines, including proper date formatting.
- Counter-examples: "What makes unicorns cry?"

[unreleased]: https://github.com/codeschool/rapporteur/compare/v0.0.6...HEAD
[0.0.6]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.0.1...v0.0.2