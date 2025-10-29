# Deployment Checklist ✅

Use this checklist to ensure your deployment is successful.

## Pre-Deployment

### Code Preparation
- [x] PostgreSQL dependency enabled in `backend/pom.xml`
- [x] Production properties configured with environment variables
- [x] Dockerfiles created (backend and frontend)
- [x] `.env.example` files created
- [ ] All code committed to git
- [ ] All code pushed to GitHub/remote repository

### Configuration Files Review
- [ ] `backend/src/main/resources/application-prod.properties` - reviewed
- [ ] `.env.production` - updated with production values
- [ ] `docker-compose.yml` - reviewed (if using Docker)
- [ ] `Dockerfile` files - reviewed

---

## Cloud Platform Setup

### Choose Your Platform
- [ ] Railway (recommended for beginners)
- [ ] Render
- [ ] AWS
- [ ] Google Cloud Platform
- [ ] Azure
- [ ] Other: _______________

---

## Database Setup

### PostgreSQL Database
- [ ] Cloud database created
- [ ] Database name created
- [ ] Database username noted
- [ ] Database password saved securely
- [ ] Database connection URL noted
- [ ] Database firewall/security rules configured
- [ ] SSL/TLS enabled (if available)

### Database Connection String Format
```
jdbc:postgresql://[HOST]:[PORT]/[DATABASE_NAME]
```

Example:
```
jdbc:postgresql://postgres.railway.internal:5432/railway
```

---

## Backend Deployment

### Environment Variables Set
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `DATABASE_URL` (full JDBC URL)
- [ ] `DB_USERNAME`
- [ ] `DB_PASSWORD`
- [ ] `JWT_SECRET` (minimum 256 bits)
- [ ] `FRONTEND_URL` (your frontend URL for CORS)
- [ ] `PORT` (if required by platform, default: 8080)

### Build Configuration
- [ ] Build command configured: `mvn clean package -DskipTests`
- [ ] Start command configured: `java -jar -Dspring.profiles.active=prod target/*.jar`
- [ ] Root directory set to `backend` (if needed)
- [ ] Java version set to 17

### Deployment
- [ ] Backend deployed successfully
- [ ] Backend logs reviewed (no errors)
- [ ] Backend URL/domain generated
- [ ] Backend health endpoint working: `/actuator/health`

**Backend URL:** `_________________________________`

---

## Frontend Deployment

### Environment Variables Set
- [ ] `VITE_API_URL` (your backend URL + `/api`)

### Build Configuration
- [ ] Build command configured: `npm install && npm run build`
- [ ] Start command configured (if needed)
- [ ] Publish directory set to `dist` (for static hosting)
- [ ] Root directory set to `/` or empty

### Deployment
- [ ] Frontend deployed successfully
- [ ] Frontend logs reviewed (no errors)
- [ ] Frontend URL/domain generated
- [ ] Frontend accessible in browser

**Frontend URL:** `_________________________________`

---

## Post-Deployment Configuration

### Update CORS
- [ ] Backend `FRONTEND_URL` updated with actual frontend URL
- [ ] Backend redeployed after CORS update
- [ ] CORS includes `https://` protocol
- [ ] No trailing slash in URLs

### Security
- [ ] JWT secret is strong (64+ characters)
- [ ] Database credentials are secure
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled on both frontend and backend
- [ ] Security headers configured
- [ ] Cookies set as secure and http-only

---

## Testing

### Backend Tests
- [ ] Health check: `GET /actuator/health`
  ```bash
  curl https://your-backend-url/actuator/health
  ```
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Authentication working (login test)
- [ ] CORS working (no console errors)

### Frontend Tests
- [ ] Homepage loads
- [ ] No console errors in browser
- [ ] API calls working
- [ ] Login functionality working
- [ ] Navigation working
- [ ] All pages accessible
- [ ] Mobile responsive (test on mobile)

### Integration Tests
- [ ] User can register/login
- [ ] Data loads correctly
- [ ] CRUD operations working
- [ ] Authentication persists
- [ ] Error handling working

---

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] Application logs accessible
- [ ] Database logs accessible
- [ ] Error tracking set up (optional: Sentry, LogRocket)
- [ ] Uptime monitoring (optional: UptimeRobot)
- [ ] Performance monitoring set up

### Backup Strategy
- [ ] Database backup configured
- [ ] Backup schedule set
- [ ] Backup restoration tested
- [ ] Code repository backed up

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Team members have access to documentation

---

## Optional Enhancements

### Custom Domain
- [ ] Domain purchased
- [ ] DNS configured
- [ ] SSL certificate installed
- [ ] Domain connected to frontend
- [ ] Domain connected to backend (optional)

### CI/CD
- [ ] Automatic deployments on push enabled
- [ ] Test suite runs before deployment
- [ ] Deployment notifications set up

### Additional Services
- [ ] CDN configured (CloudFlare, etc.)
- [ ] Email service set up (if needed)
- [ ] File storage set up (if needed)
- [ ] Redis/caching set up (if needed)

---

## Rollback Plan

### If Deployment Fails
- [ ] Previous deployment can be restored
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Team knows how to rollback

---

## Go-Live

### Final Checks
- [ ] All stakeholders notified
- [ ] Demo/testing completed
- [ ] User documentation updated
- [ ] Support team briefed

### Launch
- [ ] Application is live ✅
- [ ] Users can access application
- [ ] No critical errors
- [ ] Performance is acceptable

**Go-Live Date:** `_______________`

---

## Post-Launch

### Week 1
- [ ] Monitor application daily
- [ ] Check error logs daily
- [ ] Monitor database performance
- [ ] Gather user feedback

### Week 2-4
- [ ] Review performance metrics
- [ ] Optimize as needed
- [ ] Address user feedback
- [ ] Plan next features/improvements

---

## Common Issues & Solutions

### Issue: CORS Error
**Solution:**
1. Check `FRONTEND_URL` in backend env vars
2. Ensure URL matches exactly (with https://)
3. Redeploy backend

### Issue: Database Connection Failed
**Solution:**
1. Verify `DATABASE_URL` format
2. Check database is running
3. Verify credentials
4. Check firewall rules

### Issue: 502 Bad Gateway
**Solution:**
1. Check backend logs
2. Verify backend is running
3. Check backend URL in frontend env vars

### Issue: Build Failed
**Solution:**
1. Check build logs
2. Verify dependencies installed
3. Check Java/Node version
4. Review build commands

---

## Contact Information

**Developer:** `_________________________________`

**Project Manager:** `_________________________________`

**DevOps/Platform:** `_________________________________`

**Support:** `_________________________________`

---

## URLs Reference

| Service | URL | Status |
|---------|-----|--------|
| Frontend Production | | [ ] |
| Backend Production | | [ ] |
| Database | | [ ] |
| Admin Panel (if any) | | [ ] |
| Documentation | | [ ] |

---

## Notes

```
Add any deployment notes here:








```

---

**Deployment completed successfully!** 🎉

Date: `_______________`  
By: `_______________`
