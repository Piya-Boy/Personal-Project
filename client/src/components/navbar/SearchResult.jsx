
import "./searchresult.scss";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";


export default function SearchResult({ users, loading, handleListItemClick }) {
  if (!users) {
    return null;
  }
  return (
    <div className="Result-Container">
      <List>
        {users.length === 0 ? (
          <Typography variant="body3" display="flex" justifyContent="center">
            No users found.
          </Typography>
        ) : (
          users.map((user) => (
            <React.Fragment key={user.id}>
              {loading ? (
                <Typography
                  variant="body3"
                  display="flex"
                  justifyContent="center"
                >
                  <Box>
                    <CircularProgress />
                  </Box>
                </Typography>
              ) : (
                <div className="Result">
                  <ListItem
                    alignItems="flex-start"
                    component={Link}
                    to={`/profile/${user.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={handleListItemClick}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={user.name}
                        src={`/upload/${user.profilePic}`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {user.username}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </div>
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </div>
  );
}