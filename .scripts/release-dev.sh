#!/bin/sh
# Script para actualizar versiones en develop

# Variable para evitar bucles
export HUSKY_SKIP_STANDARD_VERSION=1

# Ejecuta standard-version sin crear commits
npx standard-version --release-as patch --skip.tag --skip.commit

# Agrega los cambios
git add CHANGELOG.md package.json package-lock.json

# Amenda el último commit
git commit --amend --no-edit --no-verify

# Limpia la variable
unset HUSKY_SKIP_STANDARD_VERSION