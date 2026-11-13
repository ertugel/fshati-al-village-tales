# Architecture rules

- Initialize browser analytics once in `index.html` using the owner's explicitly public measurement ID and keep custom events in the existing analytics helper; do not load a parallel Tag Manager container, which can duplicate events, or expose stored secret values.