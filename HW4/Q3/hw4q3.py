## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect eye state

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize
from sklearn.decomposition import PCA

######################################### Reading and Splitting the Data ###############################################
# XXX
# TODO: Read in all the data. Replace the 'xxx' with the path to the data set.
# XXX
data = pd.read_csv('eeg_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the parameter 'shuffle' set to true and the 'random_state' set to 100.
# XXX


# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX

x_train, x_test, y_train, y_test = train_test_split(x_data, y_data, test_size=0.30, random_state=random_state, shuffle=True)

regr = LinearRegression()

# Train the model using the training sets
regr.fit(x_train, y_train)

# Make predictions using the testing set
y_test_pred = regr.predict(x_test)
# Make predictions using the testing set
y_train_pred = regr.predict(x_train)


# XXX
# TODO: Test its accuracy (on the training set) using the accuracy_score method.
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Round the output values greater than or equal to 0.5 to 1 and those less than 0.5 to 0. You can use y_predict.round() or any other method.
# XXX

test_accuracy = round(accuracy_score(y_test, y_test_pred.round()), 2)
train_accuracy = round(accuracy_score(y_train, y_train_pred.round()), 2)

# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX


# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

rf = RandomForestClassifier()
rf.fit(x_train, y_train)
y_test_pred_rf = rf.predict(x_test)
y_train_pred_rf = rf.predict(x_train)
test_accuracy_rf = round(accuracy_score(y_test, y_test_pred_rf.round()), 2)
train_accurac_rf = round(accuracy_score(y_train, y_train_pred_rf.round()), 2)s

# XXX
# TODO: Determine the feature importance as evaluated by the Random Forest Classifier.
#       Sort them in the descending order and print the feature numbers. The report the most important and the least important feature.
#       Mention the features with the exact names, e.g. X11, X1, etc.
#       Hint: There is a direct function available in sklearn to achieve this. Also checkout argsort() function in Python.
# XXX


# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX
scaler = StandardScaler()

scaler_train = scaler.fit(x_train)

# scaler_train

# scaler_train.mean_

pp =scaler_train.transform(x_train)

# pp

# rf

params_rf = {
    'bootstrap': [True],
    'max_depth': [14, 40, 60, 100],
    'n_estimators': [14, 35, 60, 85]
}



rf_tune = GridSearchCV(estimator = rf, param_grid = params_rf, cv=10, n_jobs = -1, verbose = 2)

rf_tune.fit(pp, y_train)

print(rf_tune.best_params_)

rf2 = RandomForestClassifier(n_estimators=85, max_depth=60)

rf2.fit(pp, y_train)

y_test_pred_rf_tune = rf2.predict(scaler.transform(x_test))

test_accuracy_rf_tune = round(accuracy_score(y_test, y_test_pred_rf_tune.round()), 2)

# print(test_accuracy_rf_tune)
print(round(rf_tune.best_score_, 2))


# ############################################ Support Vector Machine ###################################################
# XXX
# TODO: Pre-process the data to standardize or normalize it, otherwise the grid search will take much longer
# TODO: Create a SVC classifier and train it.
# XXX


# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

svc = SVC()
svc.fit(x_train, y_train)
y_test_pred_svc = svc.predict(x_test)
y_train_pred_svc = svc.predict(x_train)
test_accuracy_svc = round(accuracy_score(y_test, y_test_pred_svc.round()), 2)
train_accurac_svc = round(accuracy_score(y_train, y_train_pred_svc.round()), 2)

# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX

params_svc = {'kernel':('linear', 'rbf'), 'C':[0.001, 0.01, 0.1, 1, 10]}

svc_tune = GridSearchCV(estimator = svc, param_grid = params_svc, cv=10, n_jobs = -1, verbose = 2)

svc_tune.fit(pp, y_train)

print(svc_tune.best_params_)

svc2 = SVC(C=10, kernel='rbf')

svc2.fit(pp, y_train)

y_test_pred_svc_tune = svc2.predict(scaler.transform(x_test))

test_accuracy_svc_tune = round(accuracy_score(y_test, y_test_pred_svc_tune.round()), 2)
# print(test_accuracy_svc_tune)

print(round(svc_tune.best_score_, 2))

###################### For Q3.3 & Q3.4##################

# svc_tune.cv_results_['mean_fit_time'][9]

# svc_tune.cv_results_['mean_train_score'][9]

# svc_tune.cv_results_['mean_test_score'][9]

# important_features_dict = {}
# for x,i in enumerate(rf.feature_importances_):
#     important_features_dict[x]=i


# important_features_list = sorted(important_features_dict,
#                                  key=important_features_dict.get,
#                                  reverse=True)


# print('Most important features: %s', important_features_list)

# ######################################### Principal Component Analysis #################################################
# XXX
# TODO: Perform dimensionality reduction of the data using PCA.
#       Set parameters n_component to 10 and svd_solver to 'full'. Keep other parameters at their default value.
#       Print the following arrays:
#       - Percentage of variance explained by each of the selected components
#       - The singular values corresponding to each of the selected components.
# XXX


