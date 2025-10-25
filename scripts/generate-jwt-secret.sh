#!/bin/bash

# Script to generate a secure JWT secret

echo "Generating secure JWT secret..."
echo ""

# Check if openssl is available
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 64 | tr -d '\n')
    echo "Generated JWT Secret (using OpenSSL):"
    echo "$SECRET"
# Check if node is available
elif command -v node &> /dev/null; then
    SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('base64'))")
    echo "Generated JWT Secret (using Node.js):"
    echo "$SECRET"
else
    echo "Error: Neither OpenSSL nor Node.js found."
    echo "Please install one of them to generate a secure secret."
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT: Keep this secret secure!"
echo "Add this to your cloud platform's environment variables as JWT_SECRET"
echo ""
