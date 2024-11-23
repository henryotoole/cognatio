# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)

## [Unreleased]

## [1.0.3] - 2024-11-23

### Added

- Dialog route to ask if a new page should be created if a link for a non-existent page is clicked.
- Touch-based pan and zoom for the map mode
- "Meta" tag to the base navigator html pages so mobile has correct scale on page load.

### Fixed

- Creation of a new page updates the graph for the current page, just in case it was already linked
- Having an empty href (.e.g <code>href=""</code>) will trip a 500 on the backend.
- Login needs to be zoomed in a bit on mobile devices. Sometimes performs very badly.

### Changed

- Switched from internal REST library (old, called Dr. Hitch) to new standalone RESTLink successor.
- Updated regional.

## [1.0.2] - 2024-09-15

### Added
- Title to tab, cognatio icon, and local static HTML template directory.

## [1.0.1] - 2024-08-30

### Added
- Dedicated login and static HTML for redirect.

## [1.0.0] - 2024-08-15
- Original release